// src/contexts/ProjectContext.js
// P0-1: 项目主线 — 跨文档(询单/报价/协议/合同)串联

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import {
  listAllProjects,
  getProjectDocuments,
  deriveProjectIdFromInquiry,
} from '../services/documentStorage';

const SESSION_KEY = 'current_project_id';

const ProjectContext = createContext({
  currentProjectId: null,
  currentProjectName: '',
  projects: [],
  setCurrentProject: () => {},
  clearCurrentProject: () => {},
  getDocs: () => ({ inquiry: [], quotation: [], agreement: [], contract: [] }),
  refresh: () => {},
  deriveProjectIdFromInquiry: () => null,
});

const readSession = () => {
  try {
    return sessionStorage.getItem(SESSION_KEY) || null;
  } catch (e) {
    return null;
  }
};

const writeSession = (projectId) => {
  try {
    if (projectId) sessionStorage.setItem(SESSION_KEY, projectId);
    else sessionStorage.removeItem(SESSION_KEY);
  } catch (e) { /* ignore */ }
};

export const ProjectProvider = ({ children }) => {
  const [currentProjectId, setProjectIdState] = useState(() => readSession());
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey(k => k + 1), []);

  const setCurrentProject = useCallback((projectId, projectName) => {
    writeSession(projectId);
    setProjectIdState(projectId);
    if (projectId && projectName) {
      try {
        sessionStorage.setItem(`${SESSION_KEY}_name`, projectName);
      } catch (e) { /* ignore */ }
    }
    refresh();
  }, [refresh]);

  const clearCurrentProject = useCallback(() => {
    writeSession(null);
    setProjectIdState(null);
    try { sessionStorage.removeItem(`${SESSION_KEY}_name`); } catch (e) { /* ignore */ }
    refresh();
  }, [refresh]);

  // 监听跨页签的 storage 变更 (备份恢复时刷新)
  useEffect(() => {
    const handler = () => refresh();
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [refresh]);

  const projects = useMemo(() => {
    void refreshKey;
    return listAllProjects();
  }, [refreshKey]);

  const currentProjectName = useMemo(() => {
    if (!currentProjectId) return '';
    const p = projects.find(x => x.projectId === currentProjectId);
    if (p) return p.projectName;
    try {
      return sessionStorage.getItem(`${SESSION_KEY}_name`) || '';
    } catch (e) { return ''; }
  }, [currentProjectId, projects]);

  const getDocs = useCallback((projectId) => {
    return getProjectDocuments(projectId || currentProjectId);
  }, [currentProjectId]);

  const value = useMemo(() => ({
    currentProjectId,
    currentProjectName,
    projects,
    setCurrentProject,
    clearCurrentProject,
    getDocs,
    refresh,
    deriveProjectIdFromInquiry,
  }), [currentProjectId, currentProjectName, projects, setCurrentProject, clearCurrentProject, getDocs, refresh]);

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);

export default ProjectContext;
