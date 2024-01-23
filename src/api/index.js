/* eslint-disable import/prefer-default-export */

import { sleep } from '../utils';

export const getAutoCompleteOptions = async (val) => {
    await sleep(300);
    const data = [
        'Apple',
        'Banana',
        'Orange',
        'Grapes',
        'Cherry',
        'Strawberry',
        'Watermelon',
        'Pineapple',
        'Mango',
        'Kiwi',
        'Blueberry',
        'Peach',
        'Plum',
        'Raspberry',
        'Blackberry',
        'Cantaloupe',
        'Cranberry',
        'Coconut',
        'Lemon',
        'Lime',
        'Grapefruit',
        'Pomegranate',
        'Avocado',
        'Pear',
        'Papaya',
        'Fig',
        'Passionfruit',
        'Dragonfruit',
        'Guava',
        'Apricot',
        'Persimmon',
        'Lychee',
        'Nectarine',
        'Pitaya',
        'Kumquat',
        'Rambutan',
        'Mulberry',
        'Clementine',
        'Tangerine',
        'Satsuma',
        'Honeydew',
        'Currant',
        'Boysenberry',
        'Cactus fruit',
        'Quince',
        'Pomelo',
        'Ugli fruit',
        'Star fruit',
        'Soursop',
        'Ackee',
        'Plantain',
        'Cherimoya',
        'Carambola',
        'Feijoa',
        'Cranberry',
        'Elderberry',
        'Jujube',
        'Juniper berry',
        'Loganberry',
        'Pawpaw',
        'Sapote',
        'Surinam cherry',
        'Tamarillo',
        'Salak',
        'Feijoa',
        'Kiwano',
        'Breadfruit',
        'Jackfruit',
        'Mamey sapote',
        'Prickly pear',
        'Yuzu',
        'Mangosteen',
        'Pitanga',
        'Santol',
        'Abiu',
        'Bilberry',
        'Camu camu',
        'Chayote',
        'Cupuaçu',
        'Gac',
        'Jamun',
        'Langsat',
        'Longan',
        'Noni',
        'Pepino',
        'Rambai',
        'Sapodilla',
        'Saskatoon berry',
        'Sea buckthorn',
        'Soursop',
    ];

    return data.filter((d) => d.toLowerCase().indexOf(val.toLowerCase()) > -1);
};
