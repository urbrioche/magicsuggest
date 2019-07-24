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


describe('Magic Suggest Other Method', () => {

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

    it('when enable() is called, the container should not have ms-ctn-disabled class', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({
            disabled: true
        });
        const disabledClassName = 'ms-ctn-disabled';
        //before enable
        expect($('#city').hasClass(disabledClassName)).toBeTruthy();
        expect($('#city input').prop('disabled')).toBeTruthy();
        //after enable
        ms.enable();
        expect($('#city').hasClass(disabledClassName)).toBeFalsy();
        expect($('#city input').prop('disabled')).toBeFalsy();
    });

    it('when expand() is called, the container should have combobox', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({
            data: ['Taipei', 'Taichung', 'Kaohsiung']
        });

        //collapse, combobox cannot be found
        expect(ms.container.find(ms.combobox).length).toBe(0);
        //expand, combobox can be found.
        ms.expand();
        expect(ms.container.find(ms.combobox).length).toBe(1);
        //console.log(ms.combobox.prop('outerHTML'));
    });

    it('init ms with disabled is true, isDisabled() should also be true', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({
            data: ['Taipei', 'Taichung', 'Kaohsiung'],
            disabled: true
        });

        expect(ms.isDisabled()).toBeTruthy();
    });

    it('validate email vtype is valid', () => {
        document.body.innerHTML = `
        <input id="email" value='["hello@gmail.com"]'/>
        `;
        const ms = $('#email').magicSuggest({
            vtype: 'email',
        });
        expect(ms.isValid()).toBeTruthy();
    });

    it('validate email vtype is invalid', () => {
        // lock of @ in email address
        document.body.innerHTML = `
        <input id="email" value='["hellogmail.com"]'/>
        `;
        const ms = $('#email').magicSuggest({
            vtype: 'email',
        });
        expect(ms.isValid()).toBeFalsy();
    });

    it('validate value by given vregex (regular expression) should be true', () => {
        document.body.innerHTML = `
        <input id="city" value='["taipei"]'/>
        `;
        const ms = $('#city').magicSuggest({
            vregex: /^[a-z]{1,6}$/,
        });
        expect(ms.isValid()).toBeTruthy();
    });

    it('validate value by given vregex (regular expression) should be false', () => {
        document.body.innerHTML = `
        <input id="city" value='["Taipei"]'/>
        `;
        const ms = $('#city').magicSuggest({
            vregex: /^[a-z]{1,5}$/,
        });
        expect(ms.isValid()).toBeFalsy();
    });

    it('getDataUrlParams', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({
            dataUrlParams: {id: 3}
        });
        expect(ms.getDataUrlParams().id).toBe(3);
    });

    it('when name is given with [], getName should return []', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({
            name: 'cities[]'
        });
        expect(ms.getName()).toBe('cities[]');
    });

    it('when name is not given with [], getName should also return []', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({
            name: 'cities'
        });
        expect(ms.getName()).toBe('cities[]');
    });

    it('getSelection() returns an array of selected JSON objects', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({
            value: [{id: 1, city: 'Taipei'}, {id: 2, city: 'Taichung'}]
        });
        expect(ms.getSelection()).toEqual([{id: 1, city: 'Taipei'}, {id: 2, city: 'Taichung'}]);
    });

    it('getRawValue() returns the current text being entered by the user.', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest();
        $('#city input').val('Hello Taipei!');
        expect(ms.getRawValue()).toEqual('Hello Taipei!');
    });

    it('removeFromSelection([object] objs, [boolean] silent) removes items from the selection.', () => {
        document.body.innerHTML = `
        <input id="city" value='[{ "id":1, "name": "Taipei" },{ "id":2, "name": "Taichung" }]' />
        `;
        const ms = $('#city').magicSuggest({
            valueField: 'id'
        });
        ms.removeFromSelection([{"id": 1, "name": "Taipei"}]);
        expect(ms.getValue()).toEqual([2]);
    });

    it('setData([array] cbItems) sets the objects listed in the combo.', () => {
        document.body.innerHTML = `
        <input id="city" value='[{ "id":1, "name": "Taipei" },{ "id":2, "name": "Taichung" }]' />
        `;
        const ms = $('#city').magicSuggest({
            valueField: 'id'
        });
        ms.setData([{'id': 3, 'name': 'Kaohsiung'}]);
        expect(ms.getData()).toEqual([{id: 3, name: 'Kaohsiung'}]);
    });

    it('setName([string] name) sets the name to be used for form submission.', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest();
        ms.setName('cities');
        expect(ms.getName()).toEqual('cities[]');
    });

    it('setSelection(object[]) sets the selection with a given array of objects.', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest();
        ms.setSelection([{id: 1, name: 'Taipei'}, {id: 2, name: 'Taichung'}]);
        expect(ms.getSelection()).toEqual([{id: 1, name: 'Taipei'}, {id: 2, name: 'Taichung'}]);
    });

    it('setValue([array] ids) sets the selection according to given values.', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest();
        ms.setValue([{id: 1, name: 'Taipei'}, {id: 2, name: 'Taichung'}]);
        expect(ms.getValue()).toEqual([1, 2]);
    });

    it('setDataUrlParams([object] params) sets extra parameters for AJAX requests.', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest();
        ms.setDataUrlParams({id: 3});
        expect(ms.getDataUrlParams()).toEqual({id: 3});
    });
});

describe('Magic Suggest Event', () => {
    it('beforeload(e, this) is fired before the AJAX request is performed', () => {
        $.ajax = jest.fn().mockImplementation();

        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({
            data: 'api/get_city'
        });

        const mockFn = jest.fn();
        $(ms).on('beforeload', () => {
            mockFn();
            //console.log('Hello');
        });

        //in order to trigger ajax call
        ms.expand();

        expect(mockFn).toHaveBeenCalled();
    });

    it('blur(e, this) is fired when the component looses focus.', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({});

        const mockFn = jest.fn();
        $(ms).on('blur', () => {
            mockFn();
        });

        ms.input.focus();
        expect(mockFn).not.toHaveBeenCalled();
        //to simulate the component looses focus
        $('body').click();
        expect(mockFn).toHaveBeenCalled();
    });

    it('collapse(e, this) is fired when the combo is collapsed.', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({});

        const mockFn = jest.fn();
        $(ms).on('collapse', () => {
            mockFn();
        });

        ms.expand();
        expect(mockFn).not.toHaveBeenCalled();
        ms.collapse();
        expect(mockFn).toHaveBeenCalled();
    });

    it('expand(e, this) is fired when the combo is expanded.', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({});

        const mockFn = jest.fn();
        $(ms).on('expand', () => {
            mockFn();
        });

        expect(mockFn).not.toHaveBeenCalled();
        ms.expand();
        expect(mockFn).toHaveBeenCalled();
    });

    it('focus(e, this) is fired when the combo gains focus.', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({});

        const mockFn = jest.fn();
        $(ms).on('focus', () => {
            mockFn();
        });

        expect(mockFn).not.toHaveBeenCalled();
        $(ms).focus();
        expect(mockFn).toHaveBeenCalled();
    });

    it('keydown(e, this, keyevent) is fired when the user presses a key', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({});

        const mockFn = jest.fn();
        $(ms).on('keydown', () => {
            mockFn();
        });

        expect(mockFn).not.toHaveBeenCalled();
        $(ms).keydown();
        expect(mockFn).toHaveBeenCalled();
    });

    it('keyup(e, this, keyevent) is fired when the user releases a key.', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({});

        const mockFn = jest.fn();
        $(ms).on('keyup', () => {
            mockFn();
        });

        expect(mockFn).not.toHaveBeenCalled();
        $(ms).keyup();
        expect(mockFn).toHaveBeenCalled();
    });

    it('load(e, this, records[]) is fired when the AJAX request has been performed', () => {
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


        const mockFn = jest.fn();
        $(ms).on('load', () => {
            mockFn();
        });

        expect(mockFn).not.toHaveBeenCalled();
        //in order to trigger ajax call
        ms.expand();
        expect(mockFn).toHaveBeenCalled();
    });

    it('selectionchange(e, this, records[]) is fired when the user has changed the selection.', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({});

        const mockFn = jest.fn();
        $(ms).on('selectionchange', () => {
            mockFn();
        });

        expect(mockFn).not.toHaveBeenCalled();
        //to simulate selection change
        ms.setSelection([1, 2, 3]);
        expect(mockFn).toHaveBeenCalled();
    });

    it('triggerclick(e, this) is fired when the user has changed the selection.', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({});

        const mockFn = jest.fn();
        $(ms).on('triggerclick', () => {
            mockFn();
        });

        expect(mockFn).not.toHaveBeenCalled();
        //simulate click the combo
        $('#city .ms-trigger').click();
        expect(mockFn).toHaveBeenCalled();
    });

});

describe('Magic Suggest Configuration', () => {
    it('allowFreeEntries set as true will allow the user to enter non-suggested entries.', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({
            allowFreeEntries: true,
            data: ['Taipei', 'Tainan']
        });
        $(ms.input).val('Chiayi');
        //simulate press enter key
        $(ms.input).trigger($.Event("keyup", {keyCode: 13}));
        expect(ms.getValue()).toEqual(['Chiayi']);
        //console.log(ms.getValue());
    });

    it('allowFreeEntries set as false will not allow the user to enter non-suggested entries.', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({
            allowFreeEntries: false,
            data: ['Taipei', 'Tainan']
        });
        $(ms.input).val('Chiayi');
        //ms.expand();
        //simulate press enter key
        $(ms.input).trigger($.Event("keyup", {keyCode: 13}));
        expect(ms.getValue()).toEqual([]);
    });

    it('when allowDuplicates is true, allows the user to reenter the same entry multiple times.', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({
            data: ['Taipei', 'Tainan'],
            allowDuplicates: true
        });
        $(ms.input).val('Chiayi');
        //ms.expand();
        $(ms.input).trigger($.Event("keyup", {keyCode: 13}));
        //simulate press enter key
        $(ms.input).val('Chiayi');
        $(ms.input).trigger($.Event("keyup", {keyCode: 13}));
        expect(ms.getValue()).toEqual(['Chiayi', 'Chiayi']);
    });

    it('ajaxConfig specifies the way ajax calls are made.', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({
            data: 'api/get_city',
            ajaxConfig: {
                xhrFields: {
                    withCredentials: true,
                }
            }
        });

        let expectedAjaxConfig = {};

        //http://blog.404mzk.com/jest.html
        //我不想用[0][0]
        //$.ajax.mock.calls[0][0].success([1])

        //靈感來自下面的網址，但是，他是用jasmine
        //https://stackoverflow.com/questions/21267250/how-do-you-spy-on-a-call-back-in-an-ajax-call-with-jasmine
        $.ajax = jest.fn().mockImplementation((param) => {
            expectedAjaxConfig = param;
        });

        //in order to trigger ajax call
        ms.expand();
        // console.log(expectedAjaxConfig);
        expect(expectedAjaxConfig).toMatchObject({
            xhrFields: {
                withCredentials: true,
            }
        });
    });

    it('when autoSelect is false, should NOT automatically selects a result if only one match is found.', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({
            data: ['Taipei', 'Taichung', 'Kaohsiung'],
            autoSelect: false,
            allowFreeEntries: false,
        });

        $(ms.input).val('Taip');
        ms.expand();
        $(ms.input).trigger($.Event("keyup", {keyCode: 13}));
        //console.log(ms.getValue());
        expect(ms.getValue()).toEqual([]);
    });

    it('when autoSelect is true, should automatically selects a result if only one match is found.', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({
            data: ['Taipei', 'Taichung', 'Kaohsiung'],
            autoSelect: true,
            allowFreeEntries: false,
        });

        $(ms.input).val('Taip');
        ms.expand();
        $(ms.input).trigger($.Event("keyup", {keyCode: 13}));
        //console.log(ms.getValue());
        expect(ms.getValue()).toEqual(['Taipei']);
    });

    it('beforeSend if a custom jQuery function that is launched prior to the ajax request.', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const mockedBeforeSend = jest.fn();
        const ms = $('#city').magicSuggest({
            data: 'api/get_city',
            beforeSend: mockedBeforeSend
        });

        //靈感來自下面的網址，但是，他是用jasmine
        let expectedAjaxConfig = {};
        $.ajax = jest.fn().mockImplementation((param) => {
            expectedAjaxConfig = param;
        });
        //in order to trigger ajax call
        ms.expand();

        expect(expectedAjaxConfig.beforeSend).toEqual(mockedBeforeSend);
    });

    it('cls specifies an additional CSS class to apply to the container element.', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({
            cls: 'custom'
        });
        expect($('#city').hasClass('custom')).toBeTruthy();
    });

    it('disabledField specifies the JSON property that defines the disabled behaviour.', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({
            data: [{id: 1, name: 'Taipei', disabled: true}, {id: 2, name: 'Tainan'}],
            disabledField: 'disabled'
        });

        ms.expand();
        expect($(ms.combobox).find('div.ms-res-item-disabled').data('json').name).toBe('Taipei');
    });

    it('displayField specifies the JSON property to be used for display.', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({
            data: [{id: 1, name: 'Taipei'}, {id: 2, name: 'Tainan'}],
            displayField: 'id',
        });

        ms.expand();
        expect($(ms.combobox).find('.ms-res-item').get().map(e => $(e).text())).toEqual(['1', '2']);
    });

    it('editable enables or prevents keyboard interaction.', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({
            data: [{id: 1, name: 'Taipei'}, {id: 2, name: 'Tainan'}],
            editable: false,
        });

        expect($(ms.container).hasClass('ms-ctn-readonly')).toBeTruthy();
        expect($(ms.input).hasClass('ms-input-readonly')).toBeTruthy();
    });

    it('expanded sets the starting state for the combo.', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({
            data: [{id: 1, name: 'Taipei'}, {id: 2, name: 'Tainan'}],
            expanded: true
        });

        expect($(ms.container).find('div.dropdown-menu').length).toBe(1);
    });

    it('expandOnFocus automatically expands the combo upon focus.', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({
            data: [{id: 1, name: 'Taipei'}, {id: 2, name: 'Tainan'}],
            expandOnFocus: true
        });

        $(ms.input).focus();
        expect($(ms.container).find('div.dropdown-menu').length).toBe(1);
    });

    it('groupBy specifies the JSON property to be used for grouping.', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({
            data: [
                {id: 1, country: 'Taiwan', city: 'Taipei'},
                {id: 2, country: 'Taiwan', city: 'Tainan'},
                {id: 3, country: 'United States', city: 'New York'},
                {id: 4, country: 'United States', city: 'Los Angeles'},
            ],
            groupBy: 'country',
            displayField: 'city',
        });

        ms.expand();
        //console.log($(ms.container).find('div.dropdown-menu').html());
        const firstGroup = $(ms.container).find('div.dropdown-menu div.ms-res-group').eq(0);
        expect(firstGroup.text()).toBe('Taiwan');
        expect(firstGroup.next().text()).toBe('Taipei');
    });

    it('hideTrigger hides the right trigger.', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({
            data: [
                {id: 1, country: 'Taiwan', city: 'Taipei'},
                {id: 2, country: 'Taiwan', city: 'Tainan'},
                {id: 3, country: 'United States', city: 'New York'},
                {id: 4, country: 'United States', city: 'Los Angeles'},
            ],
            hideTrigger: true
        });

        expect(ms.container.hasClass('ms-no-trigger')).toBeTruthy();
    });

    it('hideTrigger hides the right trigger.', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({
            data: [
                {id: 1, country: 'Taiwan', city: 'Taipei'},
                {id: 2, country: 'Taiwan', city: 'Tainan'},
                {id: 3, country: 'United States', city: 'New York'},
                {id: 4, country: 'United States', city: 'Los Angeles'},
            ],
            highlight: true,
            displayField: 'city',
        });

        ms.input.val('Tai');
        ms.expand();
        // should find Taipei Tainan
        expect(ms.container.find('.dropdown-menu em').length).toBe(2);
    });

    it('id gives the component a specific identifier.', () => {
        document.body.innerHTML = `
        <input class="city" />
        `;
        const ms = $('.city').magicSuggest({
            data: [
                {id: 1, country: 'Taiwan', city: 'Taipei'},
                {id: 2, country: 'Taiwan', city: 'Tainan'},
                {id: 3, country: 'United States', city: 'New York'},
                {id: 4, country: 'United States', city: 'Los Angeles'},
            ],
            id: 'my-custom-id'
        });

        expect($('#my-custom-id').magicSuggest()).toBe(ms);
    });

    it('infoMsgCls adds a class to the information text', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({
            data: [
                {id: 1, country: 'Taiwan', city: 'Taipei'},
                {id: 2, country: 'Taiwan', city: 'Tainan'},
                {id: 3, country: 'United States', city: 'New York'},
                {id: 4, country: 'United States', city: 'Los Angeles'},
            ],
            infoMsgCls: 'custom'
        });

        expect(ms.helper.hasClass('custom')).toBeTruthy();
    });

    it('inputCfg adds properties to the input dom element.', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({
            data: [
                {id: 1, country: 'Taiwan', city: 'Taipei'},
                {id: 2, country: 'Taiwan', city: 'Tainan'},
                {id: 3, country: 'United States', city: 'New York'},
                {id: 4, country: 'United States', city: 'Los Angeles'},
            ],
            inputCfg: {"ng-model": "customer.city"}
        });

        expect(ms.input.attr('ng-model')).toBe('customer.city');
    });

    it('invalidCls specifies the class to be used to style an invalid entry.', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({
            data: [
                {id: 1, country: 'Taiwan', city: 'Taipei'},
                {id: 2, country: 'Taiwan', city: 'Tainan'},
                {id: 3, country: 'United States', city: 'New York'},
                {id: 4, country: 'United States', city: 'Los Angeles'},
            ],
            invalidCls: 'custom'
        });

        ms.isValid = jest.fn().mockReturnValue(false);
        $(ms.container).trigger('blur');
        expect(ms.container.hasClass('custom')).toBeTruthy();
    });

    it('matchCase filters data using case sensitivity.', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({
            data: [
                {id: 1, country: 'Taiwan', city: 'Taipei'},
                {id: 2, country: 'Taiwan', city: 'Tainan'},
                {id: 3, country: 'United States', city: 'New York'},
                {id: 4, country: 'United States', city: 'Los Angeles'},
            ],
            displayField: 'city',
            valueField: 'city',
            matchCase: true
        });

        ms.input.val('Tai');
        ms.expand();
        expect(ms.combobox.find('.ms-res-item').get().map(e => $(e).data('json'))).toMatchObject([
            {id: 1, country: 'Taiwan', city: 'Taipei'},
            {id: 2, country: 'Taiwan', city: 'Tainan'},
        ]);
    });

    it('maxEntryLength defines the max number of characters for free entries.', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({
            maxEntryLength: 5
        });

        ms.input.val('123456');
        ms.container.trigger('keyup');
        expect(ms.helper.html()).toBe('Please reduce your entry by 1 character');
    });

    it('maxEntryRenderer sets the helper message for entries that are too long.', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({
            maxEntryLength: 5,
            maxEntryRenderer: function (v) {
                return 'TOO LONG DUMMY!!';
            }
        });

        ms.input.val('123456');
        ms.container.trigger('keyup');
        expect(ms.helper.html()).toBe('TOO LONG DUMMY!!');
    });

    it('maxSuggestions defines how many items the combo box can display at once.', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({
            data: [
                {id: 1, country: 'Taiwan', city: 'Taipei'},
                {id: 2, country: 'Taiwan', city: 'Tainan'},
                {id: 3, country: 'United States', city: 'New York'},
                {id: 4, country: 'United States', city: 'Los Angeles'},
            ],
            maxSuggestions: 2
        });

        ms.expand();
        expect(ms.combobox.find('.ms-res-item').length).toBe(2);
    });

    it('maxSelection sets the limit of items that can be selected. Should take effect when added one by one', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({
            maxSelection: 3
        });

        ms.addToSelection({id: 'Taipei'});
        ms.addToSelection({id: 'Taichung'});
        ms.addToSelection({id: 'Tainan'});
        ms.addToSelection({id: 'Kaohsiung'});
        expect(ms.getSelection()).toMatchObject([
            {id: 'Taipei'},
            {id: 'Taichung'},
            {id: 'Tainan'}
        ]);
    });

    it('maxSelection sets the limit of items that can be selected. Should take effect when initial selection count is same as maxSelection', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({
            maxSelection: 3
        });

        //init with 3 items, the same as maxSelection
        ms.addToSelection([
            {id: 'Taipei'},
            {id: 'Taichung'},
            {id: 'Tainan'}
        ]);

        ms.addToSelection({id: 'Kaohsiung'});
        expect(ms.getSelection()).toMatchObject([
            {id: 'Taipei'},
            {id: 'Taichung'},
            {id: 'Tainan'}
        ]);
    });

    it('maxSelection sets the limit of items that can be selected. Should not take effect when initial items less than maxSelection-> a bug?', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({
            maxSelection: 3
        });

        //init with 2 items, less than maxSelection
        ms.addToSelection([
            {id: 'Taipei'},
            {id: 'Taichung'},
        ]);

        // add additional two items
        ms.addToSelection([
            {id: 'Tainan'},
            {id: 'Kaohsiung'}
        ]);

        // you can see, we got four items unexpectedly
        expect(ms.getSelection()).toMatchObject([
            {id: 'Taipei'},
            {id: 'Taichung'},
            {id: 'Tainan'},
            {id: 'Kaohsiung'}
        ]);
    });


    it('method sets the HTTP protocol method.', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({
            data: 'api/get_city',
            method: 'GET'
        });

        let expectedAjaxConfig = {};
        $.ajax = jest.fn().mockImplementation((param) => {
            expectedAjaxConfig = param;
        });
        //in order to trigger ajax call
        ms.expand();

        expect(expectedAjaxConfig.type).toEqual('GET');
    });

    it('minChars defines the minimum amount of characters before expanding the combo. When less than 2 characters, expand event should not be trigger', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({
            data: 'api/get_city',
            minChars: 2
        });

        ms.input.val('b');

        const mockFn = jest.fn();
        $(ms).on('expand', () => {
            mockFn();
        });

        ms.expand();
        expect(mockFn).not.toHaveBeenCalled();

    });

    it('minChars defines the minimum amount of characters before expanding the combo. When more than 2 characters, expand event should be trigger', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;
        const ms = $('#city').magicSuggest({
            data: 'api/get_city',
            minChars: 2
        });

        ms.input.val('Hello');

        const mockFn = jest.fn();
        $(ms).on('expand', () => {
            mockFn();
        });

        ms.expand();
        expect(mockFn).toHaveBeenCalled();

    });

    it('', () => {
        document.body.innerHTML = `
        <input id="city" />
        `;

        const mockFn = jest.fn();
        const ms = $('#city').magicSuggest({
            data: 'api/get_city',
            minChars: 3,
            minCharsRenderer: mockFn
        });

        ms.input.val('He');
        $(ms.input).focus();
        // $(ms).on('expand', () => {
        //     mockFn();
        // });
        //
        // ms.expand();
        expect(mockFn).toHaveBeenCalled();

    });


});