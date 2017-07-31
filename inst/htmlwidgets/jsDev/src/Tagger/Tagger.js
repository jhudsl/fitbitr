const TagBrush = require('./TagBrush');
const TagInput = require('./TagInput');

/* Sets up a given days tag interface. Wraps an input and a d3 brush behavior and spits out new tags. */
const Tagger = (config) => {
  const {
    svg,
    sel,
    height,
    width,
    scales,
    date,
    onTag,
    fontFamily,
  } = config;

  let allowBrush = true;

  // set up input
    const tagInput = TagInput({
      sel,
      date,
      scales,
      onTag,
      fontFamily,
    });

    TagBrush({
      svg,
      width,
      height,
      allowBrush,
      scales,
      onBrush: (range) => {
        if (allowBrush) {
          tagInput.move(range);
        }
      },
      onClickOff: () => tagInput.hide(),
    });

    return {
      changePlaceHolder: tagInput.changePlaceholder,
    };
};


module.exports = Tagger;
