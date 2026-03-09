import { useNewsvendorBitacora } from '@/views/Overview/hooks/useSimulationBitacora';
import { useMemo, useCallback } from 'react';
import { downloadPdf } from '../downloadPdf';
import { generateNewsvendorPdf } from '../usePdf';
import { mapLogToNewsvendorPdfPayload } from './mapLogToNewsvendorPdfPayload ';

// This hook generates a PDF report for the newsvendor sim based on the selected log from
// the bitacora.

export const useNewsvendorPdf = (
  shopId?: string,
  logId?: string,
  shopName?: string
) => {
  const logs = useNewsvendorBitacora(shopId);

  const selectedLog = useMemo(
    () => logs.find((l) => l.createdAt === logId) ?? logs[0],
    [logs, logId]
  );

  const payload = useMemo(
    () =>
      selectedLog ? mapLogToNewsvendorPdfPayload(selectedLog, shopName) : null,
    [selectedLog]
  );

  const generatePdf = useCallback(async () => {
    if (!payload) return;
    // console.log("PDF PAYLOAD >>>", payload);

    const blob = await generateNewsvendorPdf(payload);
    if (blob) {
      const safeDate = payload.request.createdAt.replace(/[:.]/g, '-');

      const fileName = `Newsvendor_${payload.request.productName}_${safeDate}.pdf`;
      // const fileName = `Newsvendor_${payload.request.productName}_${payload.request.createdAt}.pdf`;
      downloadPdf(blob, fileName);
    }
  }, [payload]);

  return { payload, selectedLog, generatePdf };
};
