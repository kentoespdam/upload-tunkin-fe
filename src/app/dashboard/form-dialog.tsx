"use client"
import InputFileZod from "@/components/form/file-zod";
import { Button } from "@/components/ui/button";
import LoadingButtonClient from "@/components/ui/button-loading";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { UploadTunkinSchema } from "@/tipes/tunkin";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { UploadCloudIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { doUpload } from "./action";

const useTunkinFormDialog=()=>{
    const {refresh}=useRouter()
    const form = useForm<UploadTunkinSchema>({
      resolver: zodResolver(UploadTunkinSchema),
      defaultValues: {
        file: undefined,
      },
    });

    const { mutate, isPending } = useMutation({
      mutationFn: doUpload,
      onSuccess: (data) => {
        if (data.errors) throw data.errors;
        toast.success(data.message);
        refresh();
      },
      onError: (error: string[]) => {
        toast.error(error.join("\n"));
      },
    });

    const onsubmit = useCallback(
      (value: UploadTunkinSchema) => {
        const formData=new FormData()
        formData.append("file", value.file)
        mutate(formData);
      },
      [mutate],
    );
    return {
        form,
        onsubmit,
        isPending
    }
}

const FormComponent=memo(()=>{
    const {form, onsubmit, isPending}=useTunkinFormDialog()
    return (
      <div className="grid gap-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onsubmit)}>
            <FieldGroup>
              <InputFileZod id="file" form={form} label="File Tunkin" />
            </FieldGroup>
          </form>
        </Form>
        <DialogFooter>
          <LoadingButtonClient
            isPending={isPending}
            title="Upload"
            type="submit"
          />
        </DialogFooter>
      </div>
    );
})
FormComponent.displayName = "FormComponent";

const TunkinFormDialog = memo(() => {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <UploadCloudIcon className="size-5" />
            <span>Upload Tunkin</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <FormComponent />
        </DialogContent>
      </Dialog>
    );
})

TunkinFormDialog.displayName = "TunkinFormDialog";

export default TunkinFormDialog;