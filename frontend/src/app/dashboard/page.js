'use client';

import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import HeroSection from '@/components/dashboard/HeroSection';
import ActionButtons from '@/components/dashboard/ActionButtons';
import LatestReport from '@/components/dashboard/LatestReport';
import ChartsGrid from '@/components/dashboard/ChartsGrid';
import AutomationStatus from '@/components/dashboard/AutomationStatus';
import { useReports } from '@/lib/hooks/useReports';
import { useCharts } from '@/lib/hooks/useCharts';
import { useToast } from '@/lib/hooks/useToast';
import Toast from '@/components/shared/Toast';

export default function DashboardPage() {
  const { latestReport, refetch: refetchReport } = useReports(true);
  const { charts, refetch: refetchCharts } = useCharts(true);
  const { toast, showToast, hideToast } = useToast();
  const [automationStatus] = useState({
    active: true,
    lastRun: new Date().toISOString()
  });

  const handleSuccess = (message, type = 'success') => {
    showToast(message, type);
    if (type === 'success') {
      setTimeout(() => {
        refetchReport();
        refetchCharts();
      }, 2000);
    }
  };

  return (
    <MainLayout>
      <Toast toast={toast} onClose={hideToast} />
      
      <HeroSection />
      
      <ActionButtons onSuccess={handleSuccess} />
      
      <LatestReport report={latestReport} />
      
      <ChartsGrid charts={charts} />
      
      <AutomationStatus lastRun={automationStatus.lastRun} />
    </MainLayout>
  );
}