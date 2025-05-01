import React, { useState, useEffect } from 'react';
import { loadAndRepairData } from './utils/repair';
import { embeddedGearboxData } from './data/embeddedData';

const DataLoadTest = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [embedded, setEmbedded] = useState(null);

  useEffect(() => {
    // 测试直接访问嵌入式数据
    try {
      console.log("测试直接访问嵌入式数据");
      const embData = embeddedGearboxData;
      console.log("嵌入式数据:", embData);
      setEmbedded(embData);
    } catch (err) {
      console.error("直接访问嵌入式数据出错:", err);
    }

    // 测试完整的数据加载过程
    const loadData = async () => {
      try {
        console.log("开始执行loadAndRepairData");
        const loadedData = await loadAndRepairData();
        console.log("数据加载成功:", loadedData);
        setData(loadedData);
        setLoading(false);
      } catch (err) {
        console.error("数据加载失败:", err);
        setError(err.message || "未知错误");
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div>正在加载数据...</div>;
  }

  if (error) {
    return (
      <div>
        <h2>数据加载错误</h2>
        <p>{error}</p>
        <h3>嵌入式数据状态</h3>
        <p>{embedded ? '嵌入式数据可用' : '嵌入式数据不可用'}</p>
        {embedded && (
          <div>
            <p>版本: {embedded._version}</p>
            <p>齿轮箱数量: {embedded.hcGearboxes?.length || 0}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <h2>数据加载成功</h2>
      <p>版本: {data?._version}</p>
      <h3>集合统计</h3>
      <ul>
        <li>HC系列: {data?.hcGearboxes?.length || 0}</li>
        <li>GW系列: {data?.gwGearboxes?.length || 0}</li>
        <li>HCM系列: {data?.hcmGearboxes?.length || 0}</li>
        <li>DT系列: {data?.dtGearboxes?.length || 0}</li>
        <li>HCQ系列: {data?.hcqGearboxes?.length || 0}</li>
        <li>GC系列: {data?.gcGearboxes?.length || 0}</li>
        <li>联轴器: {data?.flexibleCouplings?.length || 0}</li>
        <li>备用泵: {data?.standbyPumps?.length || 0}</li>
      </ul>
    </div>
  );
};

export default DataLoadTest; 