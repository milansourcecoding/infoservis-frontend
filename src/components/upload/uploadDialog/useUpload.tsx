import { useState, useCallback } from 'react';
import axios from 'src/utils/axios';
import { useSnackbar } from 'src/components/snackbar';
import { useLocales } from 'src/locales';
import { formatBytes } from '../../../utils/utils.tsx';

// ----------------------------------------------------------------------

export interface UseUploadOptions {
  path: string,
  multiple?: boolean,
  numOfFiles?: number | null,
  maxFileSize?: number | null,
  onSuccess?: (data: any | null, state: boolean | null) => void,
}

export function useUpload({ path, multiple = true, numOfFiles = null, maxFileSize = null, onSuccess }: UseUploadOptions) {
  const { t } = useLocales();
  const { enqueueSnackbar } = useSnackbar();

  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [loadedProgress, setLoadedProgress] = useState<number | null>(null);
  const [totalProgress, setTotalProgress] = useState<number | null>(null);

  const isOverFilesLimit = (multiple && numOfFiles != null) ? files.length > numOfFiles : false;
  const oversizedFiles = (maxFileSize != null) ? files.filter((file: any) => file.size > maxFileSize) : [];

  const reset = useCallback(() => {
    setFiles([]);
    setProgress(null);
    setLoadedProgress(null);
    setTotalProgress(null);
  }, []);

  const handleDrop = useCallback((acceptedFiles: any) => {
    const newFiles = acceptedFiles.map((file: any) =>
      Object.assign(file, { preview: URL.createObjectURL(file) })
    );

    if(multiple){
      setFiles((prev) => [...prev, ...newFiles]);
    } else {
      setFiles(newFiles.slice(0, 1));
    }
  }, [multiple]);

  const handleRemoveFile = useCallback((inputFile: any) => {
    setFiles((prev) => prev.filter((file) => file !== inputFile));
  }, []);

  const handleUpload = useCallback(() => {
      if(isOverFilesLimit){
        enqueueSnackbar(`${t('uploading.title1')} ${numOfFiles} ${t('uploading.title2')}`, { variant: 'warning' });
        return;
    }
    if(oversizedFiles.length > 0){
        enqueueSnackbar(`${t('uploading.maxSizeError')} ${formatBytes(maxFileSize as number)}`, { variant: 'warning' });
        return;
    }
    if(!files || files.length === 0){
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    files.forEach((item: any, index: number) => {
      formData.append(`filePath[${index}]`, item);
    });

    axios.post(path, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e: any) => {
        const loaded = e?.loaded ?? 0;
        const total = e?.total ?? 0;
        const value = total ? Math.round((100 * loaded) / total) : 0;
        setProgress(value);
        setLoadedProgress(loaded);
        setTotalProgress(total);
      },
    }).then((result) => {
      setIsLoading(false);
      setProgress(null);
      setLoadedProgress(null);
      setTotalProgress(null);
      enqueueSnackbar(t('uploading.success'), { variant: 'success' });
      onSuccess?.(result, true);
      reset();
    }).catch(() => {
      setIsLoading(false);
      setProgress(null);
      setLoadedProgress(null);
      setTotalProgress(null);
      enqueueSnackbar(t('uploading.error'), { variant: 'error' });
      onSuccess?.(null, false);
    });
  }, [files, isOverFilesLimit, oversizedFiles, maxFileSize, numOfFiles, path, onSuccess, reset, enqueueSnackbar, t]);

  return {
    files,
    setFiles,
    isLoading,
    progress,
    loadedProgress,
    totalProgress,
    isOverFilesLimit,
    oversizedFiles,
    handleDrop,
    handleRemoveFile,
    handleUpload,
    reset,
  };
}