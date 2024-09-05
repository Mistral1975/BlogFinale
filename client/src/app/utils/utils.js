// utils/utils.js

export const normalizeAccents = (str) => {
  const accentMap = {
    'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a',
    'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
    'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
    'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
    'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
    'ñ': 'n', 'ç': 'c',
    'ß': 'ss'
  };

  return str.replace(/[àáâãäåèéêëìíîïòóôõöùúûüñçß]/g, match => accentMap[match]);
};

// Funzione per normalizzare i tag di postsList
export const normalizedPostsList = (postsList) => {
  return postsList.map(post => ({
    ...post,
    tags: [...new Set(
      post.tags
        .split(',')
        .map(tag => tag.trim().toLowerCase()) // Convertire in minuscolo e rimuovere spazi extra
        .map(tag => normalizeAccents(tag)) // Normalizzare le lettere accentate                        
        .map(tag => tag.replace(/'/g, ' ')) // Sostituire gli apostrofi con spazi
        .map(tag => tag.replace(/[^a-z0-9\s-]/g, '')) // Rimuovere caratteri indesiderati
        .map(tag => tag.replace(/\s+\b\w\b\s+/g, '-')) // Sostituire caratteri singoli tra parole con un trattino
        .map(tag => tag.replace(/\s+/g, '-')) // Sostituire gli spazi con "-"
    )]
  }));
};


























// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/tags/:tag*',
        destination: '/tags/[tag]'
      }
    ];
  },
};


