import React from 'react';
import './RouteSkeleton.css';

const RouteSkeleton = ({ label = '页面加载中' }) => {
  return (
    <div className="route-skeleton" role="status" aria-label={label}>
      <div className="route-skeleton__header">
        <div className="route-skeleton__bar route-skeleton__bar--title" />
        <div className="route-skeleton__bar route-skeleton__bar--subtitle" />
      </div>
      <div className="route-skeleton__grid">
        <div className="route-skeleton__card" />
        <div className="route-skeleton__card" />
        <div className="route-skeleton__card" />
        <div className="route-skeleton__card" />
      </div>
      <div className="route-skeleton__rows">
        <div className="route-skeleton__bar" />
        <div className="route-skeleton__bar route-skeleton__bar--short" />
        <div className="route-skeleton__bar" />
      </div>
      <span className="route-skeleton__label">{label}…</span>
    </div>
  );
};

export default RouteSkeleton;
