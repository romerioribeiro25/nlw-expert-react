import { ChangeEvent, useMemo, useState, useCallback } from "react";
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Navbar } from "./components/navbar";
import { NewNoteCard } from "./components/new-note-card";
import { NoteCard } from "./components/note-card";
import { ThemeProvider, useTheme } from "./context/theme";

interface Note {
  id: string;
  date: Date;
  content: string;
}

function App() {
  const { userPrefersTheme } = useTheme();
  const [search, setSearch] = useState("");

  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem("notes");

    if (notesOnStorage) {
      return JSON.parse(notesOnStorage);
    }

    return [];
  });

  const onNoteCreated = useCallback((content: string) => {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    };

    setNotes(prevNotes => {
      const notesArray = [newNote, ...prevNotes];
      localStorage.setItem("notes", JSON.stringify(notesArray));
      
      return notesArray;
    })
  } , [setNotes])

  const onNoteDeleted = useCallback((id: string) => {
    setNotes((prevNotes) => {
      const notesArray = prevNotes.filter((note) => note.id !== id);
      localStorage.setItem("notes", JSON.stringify(notesArray));

      return notesArray;
    })
  }, [setNotes])

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;

    setSearch(query);
  }

  const filteredNotes = useMemo(() => {
    if (search.trim() !== "") {
      return notes.filter((note) => 
        note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      )
    }

    return notes
  }, [search, notes]);

  const helmetHtmlClassName = useMemo(() => userPrefersTheme, [userPrefersTheme]);

  return ( 
    <HelmetProvider>
      <Helmet>
        <html className={helmetHtmlClassName} />
      </Helmet>

      <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
        <Navbar />
        <form className="w-full">
          <input
            type="text"
            placeholder="Busque em suas notas..."
            className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-state-500"
            onChange={handleSearch}
          />
        </form>

        <div className="h-px bg-slate-200 dark:bg-slate-700" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
          <NewNoteCard onNoteCreated={onNoteCreated} />

          {filteredNotes.map((note) => (
            <NoteCard onNoteDeleted={onNoteDeleted} key={note.id} note={note} />
          ))}
        </div>
      </div>
    </HelmetProvider>
  ); 
} 

export function ThemedApp() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
} 

