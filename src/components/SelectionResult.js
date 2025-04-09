import React from 'react';
import { Card, Button, Table } from 'react-bootstrap';

const SelectionResult = ({ result, onGenerateQuotation }) => {
  if (!result || !result.gearbox) {
    return <div>未找到合适的齿轮箱</div>;
  }

  const { gearbox } = result;

  return (
    <div>
      <h2>选型结果</h2>
      <Card className="mb-4">
        <Card.Header>齿轮箱信息</Card.Header>
        <Card.Body>
          <Table striped bordered>
            <tbody>
              <tr>
                <td>型号</td>
                <td>{gearbox.model}</td>
              </tr>
              <tr>
                <td>输入转速范围</td>
                <td>{gearbox.inputSpeedRange.join('-')} rpm</td>
              </tr>
              <tr>
                <td>速比</td>
                <td>{gearbox.ratios.join(', ')}</td>
              </tr>
              <tr>
                <td>传递能力</td>
                <td>{gearbox.transferCapacity.join(', ')}</td>
              </tr>
              <tr>
                <td>推力</td>
                <td>{gearbox.thrust} kN</td>
              </tr>
              <tr>
                <td>中心距</td>
                <td>{gearbox.centerDistance} mm</td>
              </tr>
              <tr>
                <td>重量</td>
                <td>{gearbox.weight} kg</td>
              </tr>
              <tr>
                <td>外形尺寸</td>
                <td>{gearbox.dimensions}</td>
              </tr>
              <tr>
                <td>控制方式</td>
                <td>{gearbox.controlType}</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Button variant="primary" onClick={onGenerateQuotation}>
        生成报价单
      </Button>
    </div>
  );
};

export default SelectionResult; 