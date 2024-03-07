import * as Dialog from "@radix-ui/react-dialog";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { X } from "lucide-react";
import { tv } from "tailwind-variants";
import { Button } from "./button";

interface NoteCardProps {
  note: {
    id: string;
    date: Date;
    content: string;
  };
  onNoteDeleted: (id: string) => void;
}

const noteCardTv = tv({
  slots: {
    triggerDialog:
      "relative flex flex-col gap-3 overflow-hidden rounded-md bg-slate-50 p-5 text-left shadow-md outline-none hover:ring-2 hover:ring-slate-200 focus-visible:ring-2 focus-visible:ring-lime-400 dark:bg-slate-800 dark:hover:ring-slate-600",
    titleDialog: "text-sm font-medium text-slate-600 dark:text-slate-300",
    descriptionDialog: "text-sm leading-6 text-slate-700 dark:text-slate-400",
    gradientOverlayDialog:
      "pointer-events-none absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white dark:from-black/60 dark:to-black/0",
    overlayDialog: "fixed inset-0 bg-black/50 ",
    contentDialog:
      "fixed inset-0 flex w-full flex-col overflow-hidden bg-white outline-none dark:bg-slate-700 md:inset-auto md:left-1/2 md:top-1/2 md:h-[60vh] md:max-w-[640px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-md",
    closeDialog:
      "absolute right-2 top-2 rounded-full p-1.5 text-slate-600 transition duration-300 hover:bg-slate-800/20 hover:text-white dark:text-slate-200 dark:hover:bg-slate-800/60 dark:hover:text-slate-400",

    wrapperContentDialog: "flex flex-1 flex-col gap-3 p-5",
    dateDialog: "text-slite-600 text-sm font-medium dark:text-slate-300",
    textDialogContent: "text-sm leading-6 text-slate-700 dark:text-slate-400",
    deleteButton:
      "group w-full bg-slate-100 text-slate-600 hover:no-underline dark:bg-slate-800 dark:text-slate-300",
    deleteButtonSpan: "text-red-500 group-hover:underline dark:text-red-400",
  },
});

export function NoteCard({ note, onNoteDeleted }: NoteCardProps) {
  const {
    triggerDialog,
    titleDialog,
    descriptionDialog,
    gradientOverlayDialog,
    overlayDialog,
    contentDialog,
    closeDialog,
    wrapperContentDialog,
    dateDialog,
    textDialogContent,
    deleteButton,
    deleteButtonSpan,
  } = noteCardTv();

  return (
    <Dialog.Root>
      <Dialog.Trigger className={triggerDialog()}>
        <span className={titleDialog()}>
          {formatDistanceToNow(note.date, {
            locale: ptBR,
            addSuffix: true,
          })}
        </span>

        <p className={descriptionDialog()}>{note.content}</p>

        <div className={gradientOverlayDialog()} />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className={overlayDialog()} />
        <Dialog.Content className={contentDialog()}>
          <Dialog.Close className={closeDialog()}>
            <X className="size-5" />
          </Dialog.Close>

          <div className={wrapperContentDialog()}>
            <span className={dateDialog()}>
              {formatDistanceToNow(note.date, {
                locale: ptBR,
                addSuffix: true,
              })}
            </span>

            <p className={textDialogContent()}>{note.content}</p>
          </div>

          <Button
            type="button"
            size="sm"
            onClick={() => onNoteDeleted(note.id)}
            className={deleteButton()}
          >
            Deseja <span className={deleteButtonSpan()}>apagar essa nota</span>?
          </Button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
