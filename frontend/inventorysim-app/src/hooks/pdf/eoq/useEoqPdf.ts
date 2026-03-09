import type { EoqCurveResponse } from '@/types/eoq-backend';
import { useEoqBitacora } from '@/views/Overview/hooks/useSimulationBitacora';
import { useMemo, useCallback } from 'react';
import { downloadPdf } from '../downloadPdf';
import { generateEoqPdf } from '../usePdf';
import { mapLogToEoqPdfPayload } from './mapLogToEoqPdfPayload';

// This hook generates a PDF report for the EOQ sim based on the selected log from
// the bitacora.

export const useEoqPdf = (
  shopId?: string,
  logId?: string,
  curve?: EoqCurveResponse | null,
  shopName?: string
) => {
  const logs = useEoqBitacora(shopId);

  const selectedLog = useMemo(
    () => logs.find((l) => l.createdAt === logId) ?? logs[0],
    [logs, logId]
  );

  const payload = useMemo(
    () =>
      selectedLog && curve
        ? mapLogToEoqPdfPayload(selectedLog, curve, shopName)
        : null,
    [selectedLog, curve, shopName]
  );

  const generatePdf = useCallback(async () => {
    if (!payload) return;

    const blob = await generateEoqPdf(payload);

    if (blob) {
      const safeDate = payload.request.createdAt.replace(/[:.]/g, '-');

      const fileName = `EOQ_${payload.request.productName}_${safeDate}.pdf`;

      downloadPdf(blob, fileName);
    }
  }, [payload]);

  return { payload, selectedLog, generatePdf };
};
