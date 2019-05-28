//import * as $ from 'jquery'
//global['$'] = global['jQuery'] = require('jquery');
//require ('../magicsuggest');

import $ from './leaked-jquery';
import '../magicsuggest';

describe('Magic Suggest Plugin Test',()=>{

    it('given value in input and call ms getValue',()=>{
        document.body.innerHTML = `
        <input id="city" value='["Tainan","Taipei", "Kaohsiung"]' />
        `;
        const ms = $('#city').magicSuggest({});
        expect(ms.getValue()).toEqual(["Tainan","Taipei", "Kaohsiung"]);
    });
});
