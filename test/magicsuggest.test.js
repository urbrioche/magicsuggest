//import * as $ from 'jquery'
//global['$'] = global['jQuery'] = require('jquery');
//require ('../magicsuggest');

import $ from './leaked-jquery';
import '../magicsuggest';

describe('Magic Suggest Plugin Test', () => {

    it('given value in input and call ms getValue', () => {
        document.body.innerHTML = `
        <input id="city" value='["Tainan","Taipei", "Kaohsiung"]' />
        `;
        const ms = $('#city').magicSuggest({});
        expect(ms.getValue()).toEqual(["Tainan", "Taipei", "Kaohsiung"]);
    });


    it('change maxSelectionRenderer message when init', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({
            maxSelection: 1,
            maxSelectionRenderer: function () {
                return 'I change the message you see';
            }
        });
        ms.setValue(['Tainan']);
        expect(ms.helper.text()).toBe('I change the message you see');
    });

    it('provides the entries to fill up the combo box', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({
            data: ['Tainan', 'Taipei', 'Kaohsiung']
        });

        let expected = [{
            id: "Tainan",
            name: "Tainan"
        }, {
            id: 'Taipei',
            name: 'Taipei'
        }, {
            id: 'Kaohsiung',
            name: 'Kaohsiung'
        }];

        expect(ms.getData()).toEqual(expected);

    });

    it('addToSelection with string array', () => {
        document.body.innerHTML = `
        <input id="city" value='["Tainan","Taipei", "Kaohsiung"]' />
        `;

        const ms = $('#city').magicSuggest({
            data: ['Tainan', 'Taipei', 'Kaohsiung']
        });

        ms.addToSelection(['2','4'])
        //console.log(ms.getSelection());
        const expected = [{
            id: 'Tainan',
            name: 'Tainan'
        }, {
            id: 'Taipei',
            name: 'Taipei'
        }, {
            id: 'Kaohsiung',
            name: 'Kaohsiung'
        }, '2', '4'];

        expect(ms.getSelection()).toEqual(expected);
    });

});

