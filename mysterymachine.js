function mystery() {
  let m = {
    pages: [
      {
        title: "yourself",
        content: "I've got work to do.",
        typeStyle: "typeWords"
      },
    ],
    pageInteractions: {
      "R/you": function() { nav(0) },
    },
    pageComparisons: []
  };

  m.pages.push({
    title: "the case:",
    content: `ya good fuckin luck`,
    typeStyle: null,
    func: null
  });

  return m
}