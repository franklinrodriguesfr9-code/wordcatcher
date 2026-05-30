import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import App from "./App";

async function addWord(english: string, portuguese: string, familiarity = "New") {
  const user = userEvent.setup();

  await user.clear(screen.getByLabelText("English word"));
  await user.type(screen.getByLabelText("English word"), english);
  await user.clear(screen.getByLabelText("Portuguese translation"));
  await user.type(screen.getByLabelText("Portuguese translation"), portuguese);
  await user.selectOptions(screen.getByLabelText("Familiarity level"), familiarity);
  await user.click(screen.getByRole("button", { name: /save word/i }));
}

async function seedWords() {
  await addWord("house", "home meaning", "New");
  await addWord("book", "reading item", "Seen a few times");
  await addWord("almost", "nearly meaning", "Almost learned");
  await addWord("learned", "known meaning", "Learned");
}

describe("WordCatcher app", () => {
  it("searches words by English or Portuguese", async () => {
    const user = userEvent.setup();
    render(<App />);
    await seedWords();

    await user.click(screen.getByRole("button", { name: /word list/i }));
    await user.type(screen.getByLabelText("Search"), "reading");

    expect(screen.getByText("book")).toBeInTheDocument();
    expect(screen.queryByText("house")).not.toBeInTheDocument();
  });

  it("filters words by familiarity", async () => {
    const user = userEvent.setup();
    render(<App />);
    await seedWords();

    await user.click(screen.getByRole("button", { name: /word list/i }));
    await user.selectOptions(screen.getByLabelText("Filter"), "Almost learned");

    expect(screen.getByText("almost")).toBeInTheDocument();
    expect(screen.queryByText("house")).not.toBeInTheDocument();
  });

  it("shows learned words in the word list with a green badge", async () => {
    const user = userEvent.setup();
    render(<App />);
    await seedWords();

    await user.click(screen.getByRole("button", { name: /word list/i }));

    const learnedCard = screen.getByText("learned").closest("article");
    expect(learnedCard).not.toBeNull();
    const learnedBadge = (learnedCard as HTMLElement).querySelector(".text-emerald-100");
    expect(learnedBadge).toHaveTextContent("Learned");
  });

  it("marks a word as learned and moves it back to review", async () => {
    const user = userEvent.setup();
    render(<App />);
    await addWord("shadow", "dark shape");

    await user.click(screen.getByRole("button", { name: /word list/i }));
    await user.click(screen.getByRole("button", { name: /mark as learned/i }));
    expect(screen.getByText("Word marked as learned.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /move back to review/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /move back to review/i }));
    expect(screen.getByText("Word moved back to review.")).toBeInTheDocument();
    expect(screen.getByLabelText("Change familiarity for shadow")).toHaveValue("Almost learned");
  });

  it("deletes a word after confirmation", async () => {
    const user = userEvent.setup();
    render(<App />);
    await addWord("delete", "remove meaning");

    await user.click(screen.getByRole("button", { name: /word list/i }));
    await user.click(screen.getByRole("button", { name: /delete/i }));
    await user.click(screen.getByRole("button", { name: /delete word/i }));

    expect(screen.queryByText("delete")).not.toBeInTheDocument();
    expect(screen.getByText("Word deleted.")).toBeInTheDocument();
  });

  it("does not auto-select learned words for review prompts", async () => {
    const user = userEvent.setup();
    render(<App />);
    await seedWords();

    await user.click(screen.getByRole("button", { name: /review prompt/i }));
    await user.click(screen.getByRole("button", { name: /select all not learned/i }));

    expect(screen.getByText("3 selected")).toBeInTheDocument();
    expect(screen.queryByText("learned")).not.toBeInTheDocument();
  });

  it("shows an error when generating a prompt without selecting a word", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /review prompt/i }));
    await user.click(screen.getByRole("button", { name: /generate prompt/i }));

    expect(screen.getByText("Select at least one word.")).toBeInTheDocument();
  });

  it("blocks duplicate words from the add page", async () => {
    render(<App />);

    await addWord("house", "home meaning");
    await addWord(" HOUSE ", "dwelling meaning");

    expect(screen.getByText("This word already exists.")).toBeInTheDocument();
  });

  it("edits a word from the list", async () => {
    const user = userEvent.setup();
    render(<App />);
    await addWord("home", "home meaning");

    await user.click(screen.getByRole("button", { name: /word list/i }));
    await user.click(screen.getByRole("button", { name: /edit/i }));
    await user.clear(screen.getByLabelText("English word"));
    await user.type(screen.getByLabelText("English word"), "house");
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(screen.getByText("Word updated.")).toBeInTheDocument();
    expect(screen.getByText("house")).toBeInTheDocument();
  });

  it("blocks duplicate words while editing", async () => {
    const user = userEvent.setup();
    render(<App />);
    await addWord("house", "home meaning");
    await addWord("book", "reading item");

    await user.click(screen.getByRole("button", { name: /word list/i }));
    const bookCard = screen.getByText("book").closest("article");
    expect(bookCard).not.toBeNull();
    await user.click(within(bookCard as HTMLElement).getByRole("button", { name: /edit/i }));
    await user.clear(screen.getByLabelText("English word"));
    await user.type(screen.getByLabelText("English word"), " House ");
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(screen.getByText("This word already exists.")).toBeInTheDocument();
  });

  it("copies a generated prompt", async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);
    render(<App />);
    await addWord("house", "home meaning");

    await user.click(screen.getByRole("button", { name: /review prompt/i }));
    await user.click(screen.getByLabelText(/house/i));
    await user.click(screen.getByRole("button", { name: /generate prompt/i }));
    await screen.findByDisplayValue(/Help me learn the English word 'house'/i);
    await user.click(screen.getByRole("button", { name: /copy prompt/i }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(expect.stringContaining("Help me learn the English word 'house'"));
    });
    expect(screen.getByText("Prompt copied.")).toBeInTheDocument();
  });
});
