// --
// Core.Agent.CustomerUserCompanySearch.js - provides the special module functions for the customer user company search
// Copyright (C) 2006-2011 c.a.p.e. IT GmbH, http://www.cape-it.de
//
// written/edited by:
//   Frank(dot)Oberender(at)cape(dash)it(dot)de
//   Martin(dot)Balzarek(at)cape(dash)it(dot)de
//
// --
// $Id: Core.Agent.CustomerUserCompanySearch.js,v 1.3 2011/10/28 12:46:44 maba Exp $
// --
// This software comes with ABSOLUTELY NO WARRANTY. For details, see
// the enclosed file COPYING for license information (AGPL). If you
// did not receive this file, see http://www.gnu.org/licenses/agpl.txt.
// --

"use strict";

var Core = Core || {};
Core.Agent = Core.Agent || {};

/**
 * @namespace
 * @exports TargetNS as Core.Agent.CustomerUserCompanySearch
 * @description
 *      This namespace contains the special module functions for the customer user company search.
 */
Core.Agent.CustomerUserCompanySearch = (function (TargetNS) {
   /**
     * @function
     * @param {jQueryObject} $Element The jQuery object of the input field with autocomplete
     * @param {Boolean} ActiveAutoComplete Set to false, if autocomplete should only be started by click on a button next to the input field
     * @return nothing
     *      This function initializes the special module functions
     */
    TargetNS.Init = function ($Element, ActiveAutoComplete) {
        var FieldID = $Element.attr('id').replace(/:/g, '\\:');

        if (typeof ActiveAutoComplete === 'undefined') {
            ActiveAutoComplete = true;
        }
        else {
            ActiveAutoComplete = !!ActiveAutoComplete;
        }

        if (isJQueryObject($Element)) {
            $Element.autocomplete({
                minLength: ActiveAutoComplete ? Core.Config.Get('Autocomplete.MinQueryLength') : 500,
                delay: Core.Config.Get('Autocomplete.QueryDelay'),
                source: function (Request, Response) {
                    var URL = Core.Config.Get('Baselink'), Data = {
                        Action: 'AgentCustomerUserCompanySearch',
                        Term: Request.term,
                        MaxResults: Core.Config.Get('Autocomplete.MaxResultsDisplayed')
                    };
                    Core.AJAX.FunctionCall(URL, Data, function (Result) {
                        var Data = [];
                        $.each(Result, function () {
                            Data.push({
                                label: this.CustomerUserCompanyValue + " (" + this.CustomerUserCompanyKey + ")",
                                value: this.CustomerUserCompanyValue
                            });
                        });
                        Response(Data);
                    });
                },
                select: function (Event, UI) {
                    var CustomerUserCompanyKey = UI.item.label.replace(/.*\((.*)\)$/, '$1');

                    $Element.val(UI.item.value);

                    // set hidden field SelectedService
                    $('#' + FieldID + 'Selected').val(CustomerUserCompanyKey);

                    Event.preventDefault();
                    return false;
                }
            });

            if (!ActiveAutoComplete) {
                $Element.after('<button id="' + $Element.attr('id') + 'Search" type="button">' + Core.Config.Get('Autocomplete.SearchButtonText') + '</button>');
                $('#' + FieldID + 'Search').click(function () {
                    $Element.autocomplete("option", "minLength", 0);
                    $Element.autocomplete("search");
                    $Element.autocomplete("option", "minLength", 500);
                });
            }
        }

        // On unload remove old selected data. If the page is reloaded (with F5) this data stays in the field and invokes an ajax request otherwise
        $(window).bind('unload', function () {
           $('#' + FieldID + 'Selected').val('');
        });
    };

    return TargetNS;
}(Core.Agent.CustomerUserCompanySearch || {}));
