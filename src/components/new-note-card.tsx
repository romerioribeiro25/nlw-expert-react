import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import { toast } from "sonner";
import { Button } from "./button";

interface NewNoteProps {
  onNoteCreated: (content: string) => void;
}

const SpeechRecognitionAPI =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const speechRecognition = new SpeechRecognitionAPI();

export function NewNoteCard({ onNoteCreated }: NewNoteProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);
  const [content, setContent] = useState("");

  const handleStartEditor = () => {
    setShouldShowOnboarding(false);
  };

  const handleContentChanged = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setContent(event.target.value);

      if (event.target.value === "") {
        setShouldShowOnboarding(true);
      }
    },
    [content],
  );

  const handleSaveNote = useCallback(
    (event: FormEvent) => {
      event.preventDefault();

      if (content.trim() === "") {
        return;
      }

      onNoteCreated(content);

      setContent("");
      setShouldShowOnboarding(true);

      toast.success("Nota criada com sucesso!");
    },
    [content],
  );

  const handleStartRecording = () => {
    const isSpeechRecognitionAPIAvailable =
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

    if (!isSpeechRecognitionAPIAvailable) {
      alert("Infelizmente seu navegador não suporta a API de gravação!");
      return;
    }

    setIsRecording(true);
    setShouldShowOnboarding(false);

    speechRecognition.lang = "pt-BR";
    speechRecognition.continuous = true;
    speechRecognition.maxAlternatives = 1;
    speechRecognition.interimResults = true;

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript);
      }, "");

      setContent(transcription);
    };

    speechRecognition.onerror = (event) => {
      console.error(event);
    };

    speechRecognition.start();
  };

  const handleStopRecording = () => {
    setIsRecording(false);

    if (speechRecognition !== null) {
      speechRecognition.stop();
    }
  };

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open && content.trim() === "") {
        setShouldShowOnboarding(true);
        handleStopRecording();
      }
    },
    [content],
  );

  return (
    <Dialog.Root onOpenChange={handleOpenChange}>
      <Dialog.Trigger className="flex flex-col gap-3 rounded-md bg-slate-50 p-5 text-left shadow-md outline-none hover:ring-2 hover:ring-slate-200 focus-visible:ring-2 focus-visible:ring-lime-400 dark:bg-slate-800 dark:hover:ring-slate-600">
        <span className="text-slite-600 text-sm font-medium dark:text-slate-200">
          Adicionar nota
        </span>

        <p className="text-sm leading-6 text-slate-700 dark:text-slate-400">
          Grave uma nota em áudio que será convertida para texto
          automaticamente.
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />

        <Dialog.Content className="fixed inset-0 flex w-full flex-col overflow-hidden bg-white outline-none dark:bg-slate-700 md:inset-auto md:left-1/2 md:top-1/2 md:h-[60vh] md:max-w-[640px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-md">
          <Dialog.Close className="absolute right-2 top-2 rounded-full p-1.5 text-slate-600 transition duration-300 hover:bg-slate-800/20 hover:text-white dark:text-slate-200 dark:hover:bg-slate-800/60 dark:hover:text-slate-400">
            <X className="size-5" />
          </Dialog.Close>

          <form className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-slite-600 text-sm font-medium dark:text-slate-300">
                Adicionar nota
              </span>

              {shouldShowOnboarding ? (
                <p className="text-sm leading-6 text-slate-700 dark:text-slate-400">
                  Comece{" "}
                  <Button type="button" onClick={handleStartRecording}>
                    gravando uma nota
                  </Button>{" "}
                  em áudio ou se preferir{" "}
                  <Button type="button" onClick={handleStartEditor}>
                    utilize apenas texto
                  </Button>
                  .
                </p>
              ) : (
                <textarea
                  autoFocus
                  className="flex-1 resize-none bg-transparent text-sm leading-6 text-slate-700 outline-none dark:text-slate-400"
                  onChange={handleContentChanged}
                  value={content}
                />
              )}
            </div>

            {isRecording ? (
              <Button
                type="button"
                color="lime"
                size="sm"
                onClick={handleStopRecording}
                className="flex w-full items-center justify-center gap-2"
              >
                <div className="size-3 animate-pulse rounded-full bg-red-500" />
                Gravando! (clique p/ interromper)
              </Button>
            ) : content.trim() !== "" ? (
              <Button
                type="button"
                color="lime"
                size="sm"
                onClick={handleSaveNote}
                className="w-full text-center"
              >
                Salvar nota
              </Button>
            ) : null}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
