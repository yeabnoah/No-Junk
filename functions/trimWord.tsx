const trim_the_first_n_words = (text: string, wordLength: number): string => {
  const words = text.split(" ");
  const truncatedText = words.slice(0, wordLength).join(" ");
  const ellipsis = words.length > wordLength ? " ..." : "";

  return truncatedText + ellipsis;
};

export default trim_the_first_n_words;
