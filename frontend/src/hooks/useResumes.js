import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import resumesApi from "@/api/resumes";
import { useUI } from "@/context/UIContext";

export function useResumes() {
  const queryClient = useQueryClient();
  const { showToast } = useUI();

  const resumesQuery = useQuery({
    queryKey: ["resumes"],
    queryFn: resumesApi.list,
  });

  const uploadMutation = useMutation({
    mutationFn: ({ file, onProgress }) => resumesApi.upload(file, onProgress),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      showToast("Resume uploaded successfully!", "success");
    },
    onError: (err) => {
      showToast(err.message || "Failed to upload resume.", "error");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: resumesApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      showToast("Resume deleted successfully.", "info");
    },
    onError: (err) => {
      showToast(err.message || "Failed to delete resume.", "error");
    },
  });

  return {
    resumes: resumesQuery.data || [],
    isLoading: resumesQuery.isLoading,
    isError: resumesQuery.isError,
    error: resumesQuery.error,
    refetch: resumesQuery.refetch,
    uploadResume: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    deleteResume: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}

export function useResumeDetail(id) {
  const queryClient = useQueryClient();
  const { showToast } = useUI();

  const detailQuery = useQuery({
    queryKey: ["resume", id],
    queryFn: () => resumesApi.get(id),
    enabled: !!id,
  });

  const analyzeMutation = useMutation({
    mutationFn: (payload) => resumesApi.analyze(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resume", id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["insights"] });
      showToast("Resume analysis complete!", "success");
    },
    onError: (err) => {
      showToast(err.message || "Analysis failed.", "error");
    },
  });

  const rewriteMutation = useMutation({
    mutationFn: (payload) => resumesApi.rewrite(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resume", id] });
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      showToast("New version created with applied rewrites!", "success");
    },
    onError: (err) => {
      showToast(err.message || "Failed to create rewrite version.", "error");
    },
  });

  return {
    data: detailQuery.data,
    isLoading: detailQuery.isLoading,
    isError: detailQuery.isError,
    refetch: detailQuery.refetch,
    analyze: analyzeMutation.mutateAsync,
    isAnalyzing: analyzeMutation.isPending,
    rewrite: rewriteMutation.mutateAsync,
    isRewriting: rewriteMutation.isPending,
  };
}
