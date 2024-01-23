/* eslint-disable import/prefer-default-export */

import './spinner.scss';

export const renderSpinner = () => {
    const spinner = document.createElement('div');
    spinner.classList.add('lds-ellipsis');
    spinner.append(
        document.createElement('div'),
        document.createElement('div'),
        document.createElement('div'),
        document.createElement('div'),
    );
    return spinner;
};
