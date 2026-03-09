import { useAbcBitacora } from '@/views/Overview/hooks/useSimulationBitacora';
import { useMemo, useCallback } from 'react';
import { downloadPdf } from '../downloadPdf';
import { generateAbcPdf } from '../usePdf';
import { mapLogToAbcPdfPayload } from './mapLogToAbcPdfPayload';


// This hook generates a PDF report for the ABC sim based on the selected log from
// the bitacora.

export const useAbcPdf = (
  shopId?: string,
  logId?: string,
  shopName?: string
) => {
  const logs = useAbcBitacora(shopId);

  const selectedLog = useMemo(
    () => logs.find((l) => l.createdAt === logId) ?? logs[0],
    [logs, logId]
  );

  const payload = useMemo(
    () => (selectedLog ? mapLogToAbcPdfPayload(selectedLog, shopName) : null),
    [selectedLog, shopName]
  );

  const generatePdf = useCallback(async () => {
    if (!payload) return;

    console.log('abc ', payload);

    const blob = await generateAbcPdf(payload);

    if (blob) {
      const safeDate = payload.request.createdAt.replace(/[:.]/g, '-');

      const fileName = `${payload.request.model}_${safeDate}.pdf`;

      downloadPdf(blob, fileName);
    }
  }, [payload]);

  return { payload, selectedLog, generatePdf };
};
