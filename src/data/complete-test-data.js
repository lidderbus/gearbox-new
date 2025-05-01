import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, File, FilePlus, Loader2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as XLSX from 'xlsx';
import { saveImportHistory, getImportHistory, clearImportHistory } from '@/utils/importHistory';
import { adaptEnhancedData } from '@/utils/dataAdapter';
import { mergeDataSources } from '@/utils/dataMerger';
import { preprocessData } from '@/utils/dataPreprocessor';

// 导入初始数据（现在从文件中导入，所以这里可以为空或只保留类型定义）
interface GearboxData { /* 你的齿轮箱数据类型 */ }
interface CouplingData { /* 你的联轴器数据类型 */ }
interface PumpData { /* 你的泵数据类型 */ }

interface AppData {
    hcGearboxes: GearboxData[];
    gwGearboxes: GearboxData[];
    hcmGearboxes: GearboxData[];
    dtGearboxes: GearboxData[];
    hcqGearboxes: GearboxData[];
    gcGearboxes: GearboxData[];
    flexibleCouplings: CouplingData[];
    standbyPumps: PumpData[];
}

interface ImportHistoryRecord {
    id: number;
    date: string;
    totalFiles: number;
    successCount: number;
    failedCount: number;
    failedFiles: { name: string; error: string }[];
    ...any
}

const DataImportPage = () => {
    const [isImporting, setIsImporting] = useState(false);
    const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [importMessage, setImportMessage] = useState('');
    const [importedData, setImportedData] = useState<AppData | null>(null); // 保存导入的数据
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [importHistory, setImportHistory] = useState<ImportHistoryRecord[]>([]);

    useEffect(() => {
        const history = getImportHistory();
        setImportHistory(history);
    }, []);

    const handleImport = useCallback(async (files: FileList | null) => {
        if (!files || files.length === 0) {
            setImportStatus('error');
            setImportMessage('请选择要导入的文件。');
            return;
        }

        setIsImporting(true);
        setImportStatus('idle');
        setImportMessage('开始导入数据...');

        let totalFiles = files.length;
        let successCount = 0;
        let failedCount = 0;
        let failedFiles: { name: string; error: string }[] = [];
        let allImportedData: Partial<AppData> = {}; // 用于累积导入的数据

        const startTime = new Date(); // 记录开始时间

        // 遍历所有选择的文件
        for (let i = 0; i < totalFiles; i++) {
            const file = files[i];
            try {
                const reader = new FileReader();
                const workbook = await new Promise<XLSX.WorkBook>((resolve, reject) => {
                    reader.onload = (e) => {
                        try {
                            const data = new Uint8Array(e.target?.result as ArrayBuffer);
                            const workbook = XLSX.read(data, { type: 'array' });
                            resolve(workbook);
                        } catch (err) {
                            reject(err);
                        }
                    };
                    reader.onerror = () => reject(new Error(`读取文件 ${file.name} 失败`));
                    reader.readAsArrayBuffer(file);
                });

                // 假设每个文件包含多个sheet，每个sheet对应一种数据类型
                const hcGearboxSheet = workbook.Sheets['HC齿轮箱'];
                const gwGearboxSheet = workbook.Sheets['GW齿轮箱'];
                const hcmGearboxSheet = workbook.Sheets['HCM齿轮箱'];
                const dtGearboxSheet = workbook.Sheets['DT齿轮箱'];
                const hcqGearboxSheet = workbook.Sheets['HCQ齿轮箱'];
                const gcGearboxSheet = workbook.Sheets['GC齿轮箱'];
                const flexibleCouplingSheet = workbook.Sheets['高弹性联轴器'];
                const standbyPumpSheet = workbook.Sheets['备用泵'];

                // 将每个sheet的数据转换为JSON
                const hcGearboxes = hcGearboxSheet ? XLSX.utils.sheet_to_json(hcGearboxSheet) : [];
                const gwGearboxes = gwGearboxSheet ? XLSX.utils.sheet_to_json(gwGearboxSheet) : [];
                const hcmGearboxes = hcmGearboxSheet ? XLSX.utils.sheet_to_json(hcmGearboxSheet) : [];
                const dtGearboxes = dtGearboxSheet ? XLSX.utils.sheet_to_json(dtGearboxSheet) : [];
                const hcqGearboxes = hcqGearboxSheet ? XLSX.utils.sheet_to_json(hcqGearboxSheet) : [];
                const gcGearboxes = gcGearboxSheet ? XLSX.utils.sheet_to_json(gcGearboxSheet) : [];
                const flexibleCouplings = flexibleCouplingSheet ? XLSX.utils.sheet_to_json(flexibleCouplingSheet) : [];
                const standbyPumps = standbyPumpSheet ? XLSX.utils.sheet_to_json(standbyPumpSheet) : [];

                // 数据适配
                const adaptedData = adaptEnhancedData({
                    hcGearboxes,
                    gwGearboxes,
                    hcmGearboxes,
                    dtGearboxes,
                    hcqGearboxes,
                    gcGearboxes,
                    flexibleCouplings,
                    standbyPumps
                });

                // 合并数据
                allImportedData = mergeDataSources(allImportedData, adaptedData);

                successCount++;
            } catch (error: any) {
                failedCount++;
                failedFiles.push({ name: file.name, error: error.message || '未知错误' });
                console.error(`导入文件 ${file.name} 失败:`, error);
            }
        }

        // 数据预处理
        const preprocessedData = preprocessData(allImportedData as AppData); // 确保传递 AppData 类型
        setImportedData(preprocessedData); // 保存预处理后的数据

        // 更新导入状态和消息
        const endTime = new Date();
        const duration = (endTime.getTime() - startTime.getTime()) / 1000; // 计算耗时（秒）

        if (failedCount === 0) {
            setImportStatus('success');
            setImportMessage(`数据导入完成！成功导入 ${successCount} 个文件，耗时 ${duration.toFixed(2)} 秒。`);
        } else {
            setImportStatus('error');
            setImportMessage(`数据导入完成！成功导入 ${successCount} 个文件，失败 ${failedCount} 个文件，耗时 ${duration.toFixed(2)} 秒。`);
        }

        // 保存导入历史
        const historyRecord: ImportHistoryRecord = {
            id: Date.now(),
            date: new Date().toLocaleString(),
            totalFiles,
            successCount,
            failedCount,
            failedFiles,
            duration: duration.toFixed(2), // 保存耗时
            importedData: preprocessedData // 保存导入的数据
        };
        saveImportHistory(historyRecord);
        setImportHistory(prev => [historyRecord, ...prev]);

        setIsImporting(false);
        // 清空文件选择
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleImport(event.target.files);
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    const clearHistory = () => {
        clearImportHistory();
        setImportHistory([]);
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">数据导入</h2>

            <div className="mb-4">
                <input
                    type="file"
                    multiple
                    accept=".xlsx,.xls"
                    onChange={handleFileSelect}
                    className="hidden"
                    ref={fileInputRef}
                />
                <Button
                    onClick={triggerFileSelect}
                    disabled={isImporting}
                    className={cn(
                        "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
                        isImporting && "opacity-50 cursor-not-allowed"
                    )}
                >
                    <FilePlus className="mr-2" />
                    选择文件
                </Button>

                {isImporting && (
                    <div className="mt-2 flex items-center text-gray-600 dark:text-gray-400">
                        <Loader2 className="animate-spin mr-2" />
                        {importMessage}
                    </div>
                )}
            </div>

            {importStatus !== 'idle' && (
                <Alert
                    variant={importStatus === 'success' ? 'default' : 'destructive'}
                    className="mb-4"
                >
                    {importStatus === 'success' ? (
                        <CheckCircle className="h-4 w-4" />
                    ) : (
                        <AlertCircle className="h-4 w-4" />
                    )}
                    <AlertTitle>
                        {importStatus === 'success' ? '导入成功' : '导入失败'}
                    </AlertTitle>
                    <AlertDescription>
                        {importMessage}
                    </AlertDescription>
                </Alert>
            )}

            {/* 导入历史 */}
            {importHistory.length > 0 && (
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">导入历史</h3>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={clearHistory}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600"
                        >
                            <XCircle className="mr-1" />
                            清空历史
                        </Button>
                    </div>
                    <div className="space-y-4">
                        {importHistory.map((record) => (
                            <div
                                key={record.id}
                                className={cn(
                                    "p-4 rounded-md border",
                                    record.failedCount > 0
                                        ? "border-red-500 bg-red-50 dark:bg-red-900/50 dark:border-red-700"
                                        : "border-green-500 bg-green-50 dark:bg-green-900/50 dark:border-green-700"
                                )}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            日期：{record.date}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            总文件数：{record.totalFiles}，成功：{record.successCount}，失败：{record.failedCount}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            耗时：{record.duration} 秒
                                        </p>
                                    </div>
                                </div>
                                {record.failedCount > 0 && (
                                    <details className="mt-2">
                                        <summary className="text-sm text-red-600 dark:text-red-400 cursor-pointer">
                                            查看失败详情
                                        </summary>
                                        <ul className="mt-2 space-y-1">
                                            {record.failedFiles.map((file, index) => (
                                                <li
                                                    key={index}
                                                    className="text-sm text-red-500 dark:text-red-300"
                                                >
                                                    {file.name}：{file.error}
                                                </li>
                                            ))}
                                        </ul>
                                    </details>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {/* Display Imported Data (for debugging) */}
            {importedData && (
                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">导入数据:</h3>
                    <pre className="bg-gray-100 dark:bg-gray-900 border rounded-md p-4 overflow-auto max-h-96 text-sm">
                        {JSON.stringify(importedData, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default DataImportPage;
