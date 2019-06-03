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
        ms.addToSelection([{id: '2'}, {id: '4'}])
        //console.log(ms.getValue());
        const expected = ['Tainan', 'Taipei', 'Kaohsiung', '2', '4'];

        expect(ms.getValue()).toEqual(expected);
    });

});


describe('Magic Suggest Method', () => {

    it('init with default options, after calling clear, getValue should return empty array', () => {
        document.body.innerHTML = `
        <input id="city" value='["Tainan","Taipei", "Kaohsiung"]' />
        `;
        const ms = $('#city').magicSuggest();
        //console.log(ms.getValue());
        //before clear
        expect(ms.getValue().length).toBe(3);
        ms.clear();
        // console.log(ms.getValue());
        //after clear
        expect(ms.getValue()).toEqual([]);
    });

    it('init ms with expanded is true, after calling collapse, the combobox should not be found', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({
            data: ['Taipei', 'Taichung', 'Kaohsiung'],
            expanded: true
        });

        //expand, combobox can be found.
        expect(ms.container.find(ms.combobox).length).toBe(1);
        //console.log(ms.combobox.prop('outerHTML'));
        ms.collapse();
        //console.log(ms.container.find(ms.combobox));
        //collapse, combobox cannot be found
        expect(ms.container.find(ms.combobox).length).toBe(0);
    });

    it('when disable() is called, ms-ctn-disabled class should be added', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest();
        expect($('#city').hasClass('ms-ctn-disabled')).toBeFalsy();
        ms.disable();
        expect($('#city').hasClass('ms-ctn-disabled')).toBeTruthy();
    });

    it('when empty() is called, input value should be clear', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest();
        ms.input.val('a');
        expect(ms.getRawValue()).toBe('a');
        ms.empty();
        expect(ms.getRawValue()).toBe('');
    });

});