//import * as $ from 'jquery'
//global['$'] = global['jQuery'] = require('jquery');
//require ('../magicsuggest');

import $ from './leaked-jquery';
import '../magicsuggest';

describe('Magic Suggest getValue', () => {

    it('given string array to input, and init magic suggest with default options', () => {
        document.body.innerHTML = `
        <input id="city" value='["Tainan","Taipei", "Kaohsiung"]' />
        `;
        const ms = $('#city').magicSuggest({});
        expect(ms.getValue()).toEqual(["Tainan", "Taipei", "Kaohsiung"]);
    });

    it('give json value to input, and init magic suggest with default options', () => {
        document.body.innerHTML = `
        <input id="city" value='[{"id":1, "name":"Taipei"},{"id":2, "name":"Taichung"},{"id":3, "name":"Kaohsiung"}]' />
        `;
        const ms = $('#city').magicSuggest({});
        //console.log(ms.getValue());
        //default valueField is id
        expect(ms.getValue()).toEqual([1, 2, 3]);
    });

    it('give json value to input, and init magic suggest with custom options', () => {
        document.body.innerHTML = `
        <input id="city" value='[{"id":1, "name":"Taipei"},{"id":2, "name":"Taichung"},{"id":3, "name":"Kaohsiung"}]' />
        `;
        //change valueField to name
        const ms = $('#city').magicSuggest({valueField: 'name'});
        //console.log(ms.getValue());
        expect(ms.getValue()).toEqual(['Taipei', 'Taichung', 'Kaohsiung']);
    });

});

describe('Magic Suggest getSelection', () => {

    it('given string array to input, and init magic suggest with default options', () => {
        document.body.innerHTML = `
        <input id="city" value='["Tainan","Taipei", "Kaohsiung"]' />
        `;
        const ms = $('#city').magicSuggest({});
        expect(ms.getSelection()).toEqual([
            {id: 'Tainan', name: 'Tainan'},
            {id: 'Taipei', name: 'Taipei'},
            {id: 'Kaohsiung', name: 'Kaohsiung'}
        ]);
    });

    it('give json value to input, and init magic suggest with default options', () => {
        document.body.innerHTML = `
        <input id="city" value='[{"id":1, "name":"Taipei"},{"id":2, "name":"Taichung"},{"id":3, "name":"Kaohsiung"}]' />
        `;
        const ms = $('#city').magicSuggest({});
        expect(ms.getSelection()).toEqual([{"id": 1, "name": "Taipei"}, {"id": 2, "name": "Taichung"}, {
            "id": 3,
            "name": "Kaohsiung"
        }]);
    });
});

describe('Magic Suggest maxSelectionRenderer', () => {

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

});

describe('Magic Suggest getData', () => {

    it('init magic suggest with string array data', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({
            data: ['Tainan', 'Taipei', 'Kaohsiung']
        });

        //default valueField is id, displayField is name
        const expected = [{
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

    it('init magic suggest with data which is fetching from url', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({
            data: 'api/get_city'
        });

        //http://blog.404mzk.com/jest.html
        //我不想用[0][0]
        //$.ajax.mock.calls[0][0].success([1])

        //靈感來自下面的網址，但是，他是用jasmine
        //https://stackoverflow.com/questions/21267250/how-do-you-spy-on-a-call-back-in-an-ajax-call-with-jasmine
        $.ajax = jest.fn().mockImplementation((param) => {
            param.success([
                {id: 1, name: 'Tainan'},
                {id: 2, name: 'Taipei'},
                {id: 3, name: 'Kaohsiung'}
            ]);
        });

        //in order to trigger ajax call
        ms.expand();

        const expected = [
            {id: 1, name: 'Tainan'},
            {id: 2, name: 'Taipei'},
            {id: 3, name: 'Kaohsiung'}
        ];

        expect(ms.getData()).toEqual(expected)
    });

});


describe('Magic Suggest addToSelection', () => {

    it('init with default options, addToSelection with string array and getSelection', () => {
        document.body.innerHTML = `
        <input id="city" value='["Tainan","Taipei", "Kaohsiung"]' />
        `;
        const ms = $('#city').magicSuggest();

        ms.addToSelection(['2', '4'])
        //console.log(ms.getSelection());
        //default valueField:id, displayField: name when not given
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

    it('addToSelection with string array and getValue', () => {
        document.body.innerHTML = `
        <input id="city" value='["Tainan","Taipei", "Kaohsiung"]' />
        `;

        const ms = $('#city').magicSuggest();

        //default valueField:id, displayField: name when not given
        //addToSelection with string array (not json)
        ms.addToSelection(['2', '4'])
        //console.log(ms.getValue());
        //console.log(ms.getSelection());
        //will not have '2','4' because no valueField property is given in addToSelection
        const expected = ['Tainan', 'Taipei', 'Kaohsiung'];

        expect(ms.getValue()).toEqual(expected);
    });

    it('addToSelection with json array and getValue', () => {
        document.body.innerHTML = `
        <input id="city" value='["Tainan","Taipei", "Kaohsiung"]' />
        `;

        const ms = $('#city').magicSuggest();
        //id is treated as valueField by default
        ms.addToSelection([{id:'2'}, {id:'4'}])
        console.log(ms.getValue());
        const expected = ['Tainan', 'Taipei', 'Kaohsiung', '2', '4'];

        expect(ms.getValue()).toEqual(expected);
    });

});
