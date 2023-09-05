const moment = require('moment');

module.exports = {
  formatDate: (date, format) => moment(date).utc().format(format),
  
  truncate: (str, len) => {
    if (str.length > len && str.length > 0) {
      let new_str = str.substr(0, len)
      new_str = new_str.substr(0, new_str.lastIndexOf(' '))
      new_str = new_str.length > 0 ? new_str : str.substr(0, len)
      return new_str + '...'
    }
    return str;
  },
  
  stripTags: (input) => input.replace(/<(?:.|\n)*?>/gm, ''),
  
  editIcon: (storyUser, loggedUser, storyId, floating = true) => {
    if (storyUser._id.toString() == loggedUser._id.toString()) {
      const link = floating ? 'btn-floating halfway-fab blue' : '';
      return `<a href="/stories/edit/${storyId}" class="${link}"><i class="fas fa-edit fa-small"></i></a>`;
    }
    return '';
  },
  
  select: (selected, options) => options.fn(this)
    .replace(new RegExp(` value="${selected}"`), '$& selected="selected"')
    .replace(new RegExp(`>${selected}</option>`), ' selected="selected"$&')
};
