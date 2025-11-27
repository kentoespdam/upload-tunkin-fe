import { QueryKey, useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type GlobalMutationProps<TData, TVariables>={
    mutationFunction:(variables:TVariables)=>Promise<TData>,
    queryKeys:QueryKey[],
    redirectTo?:string,
    actHandler?:()=>void
    refreshPage?:boolean
}

export const useGlobalMutation = <TData, TVariables>({
  mutationFunction,
  queryKeys,
  redirectTo,
  actHandler,
  refreshPage,
}: GlobalMutationProps<TData, TVariables>): UseMutationResult<
  TData,
  Error,
  TVariables,
  unknown
> => {
  const { push, refresh } = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mutationFunction,
    onSuccess: async (data: TData) => {
        const result = data as TData & { status: number; message: string };
        if (result.status !== 200 && result.status !== 201)
          throw new Error(JSON.stringify(result));
    
      if (refreshPage) refresh();
    
      toast.success(`Success`, {
        description: result.message,
        className: "bg-primary text-primary-foreground",
      });

      for (const queryKey of queryKeys) {
        await queryClient.invalidateQueries({ queryKey });
      }

      if (redirectTo) push(redirectTo);

      if (actHandler) actHandler();
    },
    onError: (error) => {
      const result = JSON.parse(error.message) as BaseResult<unknown>;
      if (result.status === 401)
        result.errors = result.errors || "Network Error. please try again";

      // if (result.status === 400) result.errors = result.message;

      if (result.errors && typeof result.errors === "object")
        for (const message of result.errors) {
          toast.error(`Error ${result.status}`, {
            description: message,
            duration: 3000,
          });
        }
      else
        toast.error(`Error ${result.errors}`, {
          description: result.errors,
          duration: 3000,
        });
      if (refreshCsrf) refreshCsrf();
    },
  });
};