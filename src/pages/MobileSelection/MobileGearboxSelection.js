/**
 * MobileGearboxSelection - 移动端齿轮箱选型页面
 *
 * 功能:
 * - 触摸优化的选型表单
 * - 快速选型预设按钮
 * - 简化的结果展示
 * - 滑动切换结果
 */
import React, { useState, useCallback, useMemo } from 'react';
import { Card, Form, Button, Badge, Alert, Spinner, Collapse } from 'react-bootstrap';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SpeedIcon from '@mui/icons-material/Speed';
import SettingsIcon from '@mui/icons-material/Settings';
import './MobileGearboxSelection.css';

// 快速选型预设
const QUICK_PRESETS = [
  { label: '小型渔船', power: 150, speed: 2000, ratio: 3.0, icon: '🚤' },
  { label: '中型货船', power: 350, speed: 1800, ratio: 4.0, icon: '🚢' },
  { label: '大型货轮', power: 600, speed: 1500, ratio: 5.0, icon: '⛴️' },
  { label: '高速艇', power: 250, speed: 2500, ratio: 2.5, icon: '🛥️' }
];

// 常用速比选项
const RATIO_OPTIONS = [2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0];

const MobileGearboxSelection = ({
  onSelect,
  gearboxDatabase = [],
  selectionAlgorithm,
  colors = {},
  theme = 'light'
}) => {
  // 表单状态
  const [power, setPower] = useState('');
  const [speed, setSpeed] = useState('');
  const [ratio, setRatio] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // 选型结果状态
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 验证表单
  const isValid = useMemo(() => {
    const p = parseFloat(power);
    const s = parseFloat(speed);
    const r = parseFloat(ratio);
    return p > 0 && s > 0 && r > 0;
  }, [power, speed, ratio]);

  // 应用预设
  const applyPreset = useCallback((preset) => {
    setPower(String(preset.power));
    setSpeed(String(preset.speed));
    setRatio(String(preset.ratio));
  }, []);

  // 执行选型
  const handleSelection = useCallback(async () => {
    if (!isValid) return;

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const params = {
        power: parseFloat(power),
        speed: parseFloat(speed),
        ratio: parseFloat(ratio)
      };

      // 使用选型算法或简单筛选
      let selectionResults;
      if (selectionAlgorithm) {
        selectionResults = await selectionAlgorithm(params);
      } else {
        // 简单筛选逻辑
        selectionResults = gearboxDatabase
          .filter(gb => {
            const minP = gb.minPower || 0;
            const maxP = gb.maxPower || Infinity;
            const minS = gb.minSpeed || 0;
            const maxS = gb.maxSpeed || Infinity;
            const ratios = gb.ratios || [];

            // 功率范围匹配
            if (params.power < minP || params.power > maxP) return false;

            // 转速范围匹配
            if (params.speed < minS || params.speed > maxS) return false;

            // 速比匹配 (±15%容差)
            const hasRatio = ratios.some(r =>
              Math.abs(r - params.ratio) / params.ratio <= 0.15
            );
            if (!hasRatio && ratios.length > 0) return false;

            return true;
          })
          .slice(0, 10)
          .map((gb, index) => ({
            ...gb,
            matchScore: 100 - index * 5,
            matchedRatio: gb.ratios?.find(r =>
              Math.abs(r - params.ratio) / params.ratio <= 0.15
            ) || params.ratio
          }));
      }

      if (selectionResults && selectionResults.length > 0) {
        setResults(selectionResults);
        setSelectedIndex(0);
      } else {
        setError('未找到符合条件的齿轮箱，请调整参数后重试');
      }
    } catch (err) {
      setError(err.message || '选型失败，请重试');
    } finally {
      setLoading(false);
    }
  }, [power, speed, ratio, isValid, selectionAlgorithm, gearboxDatabase]);

  // 选择结果
  const handleSelectResult = useCallback((result) => {
    onSelect?.(result);
  }, [onSelect]);

  // 当前选中的结果
  const currentResult = results[selectedIndex];

  return (
    <div className={`mobile-selection ${theme === 'dark' ? 'dark-theme' : ''}`}>
      {/* 选型表单 */}
      <Card className="mobile-selection-card">
        <Card.Header className="mobile-card-header">
          <SettingsIcon className="header-icon" />
          <span>齿轮箱选型</span>
        </Card.Header>

        <Card.Body className="mobile-card-body">
          {/* 快速预设 */}
          <div className="quick-presets">
            <label className="preset-label">快速选型:</label>
            <div className="preset-buttons">
              {QUICK_PRESETS.map((preset, index) => (
                <button
                  key={index}
                  className="preset-btn"
                  onClick={() => applyPreset(preset)}
                >
                  <span className="preset-icon">{preset.icon}</span>
                  <span className="preset-text">{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 主要参数输入 */}
          <div className="input-group-mobile">
            <Form.Group className="mobile-form-group">
              <Form.Label>
                <SpeedIcon fontSize="small" /> 功率 (kW)
              </Form.Label>
              <Form.Control
                type="number"
                inputMode="decimal"
                placeholder="输入功率"
                value={power}
                onChange={(e) => setPower(e.target.value)}
                className="mobile-input"
              />
            </Form.Group>

            <Form.Group className="mobile-form-group">
              <Form.Label>
                <SpeedIcon fontSize="small" /> 转速 (rpm)
              </Form.Label>
              <Form.Control
                type="number"
                inputMode="decimal"
                placeholder="输入转速"
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
                className="mobile-input"
              />
            </Form.Group>

            <Form.Group className="mobile-form-group">
              <Form.Label>
                <TuneIcon fontSize="small" /> 减速比
              </Form.Label>
              <div className="ratio-selector">
                <Form.Control
                  type="number"
                  inputMode="decimal"
                  placeholder="输入速比"
                  value={ratio}
                  onChange={(e) => setRatio(e.target.value)}
                  className="mobile-input ratio-input"
                />
                <div className="ratio-quick-btns">
                  {RATIO_OPTIONS.slice(0, 5).map(r => (
                    <button
                      key={r}
                      className={`ratio-btn ${parseFloat(ratio) === r ? 'active' : ''}`}
                      onClick={() => setRatio(String(r))}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </Form.Group>
          </div>

          {/* 高级选项 */}
          <div className="advanced-toggle">
            <Button
              variant="link"
              className="advanced-btn"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              <span>高级选项</span>
            </Button>
          </div>

          <Collapse in={showAdvanced}>
            <div className="advanced-options">
              <Form.Group className="mobile-form-group">
                <Form.Label>应用场景</Form.Label>
                <Form.Select className="mobile-input">
                  <option value="">不限</option>
                  <option value="fishing">渔船</option>
                  <option value="cargo">货船</option>
                  <option value="passenger">客船</option>
                  <option value="tug">拖船</option>
                </Form.Select>
              </Form.Group>
            </div>
          </Collapse>

          {/* 选型按钮 */}
          <Button
            variant="primary"
            size="lg"
            className="selection-btn"
            onClick={handleSelection}
            disabled={!isValid || loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                选型中...
              </>
            ) : (
              <>
                <SearchIcon className="me-2" />
                开始选型
              </>
            )}
          </Button>
        </Card.Body>
      </Card>

      {/* 错误提示 */}
      {error && (
        <Alert variant="warning" className="mobile-alert">
          {error}
        </Alert>
      )}

      {/* 选型结果 */}
      {results.length > 0 && (
        <div className="mobile-results">
          <div className="results-header">
            <h3>选型结果</h3>
            <Badge bg="success">{results.length} 个推荐</Badge>
          </div>

          {/* 结果指示器 */}
          <div className="results-indicator">
            {results.map((_, index) => (
              <button
                key={index}
                className={`indicator-dot ${index === selectedIndex ? 'active' : ''}`}
                onClick={() => setSelectedIndex(index)}
              />
            ))}
          </div>

          {/* 当前结果卡片 */}
          {currentResult && (
            <Card className="result-card">
              <Card.Header className="result-header">
                <div className="result-title">
                  <CheckCircleIcon className="result-icon" />
                  <span className="result-model">{currentResult.model}</span>
                </div>
                <Badge bg="primary" className="result-series">
                  {currentResult.series}
                </Badge>
              </Card.Header>

              <Card.Body className="result-body">
                <div className="result-specs">
                  <div className="spec-item">
                    <span className="spec-label">传递能力</span>
                    <span className="spec-value">
                      {(currentResult.transmissionCapacity ||
                        currentResult.transmissionCapacityPerRatio?.[0] ||
                        '-').toFixed?.(3) || '-'} kW/rpm
                    </span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">匹配速比</span>
                    <span className="spec-value">{currentResult.matchedRatio || '-'}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">额定推力</span>
                    <span className="spec-value">{currentResult.thrust || '-'} kN</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">重量</span>
                    <span className="spec-value">{currentResult.weight || '-'} kg</span>
                  </div>
                </div>

                {currentResult.price && (
                  <div className="result-price">
                    <span className="price-label">参考价格</span>
                    <span className="price-value">
                      ¥{currentResult.price.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="result-actions">
                  <Button
                    variant="outline-primary"
                    className="action-btn"
                    onClick={() => setSelectedIndex(Math.max(0, selectedIndex - 1))}
                    disabled={selectedIndex === 0}
                  >
                    上一个
                  </Button>
                  <Button
                    variant="primary"
                    className="action-btn select-btn"
                    onClick={() => handleSelectResult(currentResult)}
                  >
                    选择此型号
                  </Button>
                  <Button
                    variant="outline-primary"
                    className="action-btn"
                    onClick={() => setSelectedIndex(Math.min(results.length - 1, selectedIndex + 1))}
                    disabled={selectedIndex === results.length - 1}
                  >
                    下一个
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}

          {/* 结果列表 */}
          <div className="results-list">
            <h4>全部推荐</h4>
            {results.map((result, index) => (
              <button
                key={result.model}
                className={`result-list-item ${index === selectedIndex ? 'selected' : ''}`}
                onClick={() => setSelectedIndex(index)}
              >
                <span className="list-item-model">{result.model}</span>
                <span className="list-item-series">{result.series}</span>
                <Badge bg={index === selectedIndex ? 'primary' : 'secondary'}>
                  {index + 1}
                </Badge>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileGearboxSelection;
