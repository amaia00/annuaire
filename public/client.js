/**
 * Created by amaia.nazabal on 1/26/17.
 * Script pour le formulaire du côté client
 *
 */
jQuery(function() {
    var annuaire  = new Annuaire();

    /**
     * Montre tous les sites de l'annuaire
     */
    var showPairs = function() {
        jQuery('#pairs-client >tbody').empty();

        jQuery.each(annuaire.collection,
            function(key, value) {
                var pairHtml = '<tr><td>' + key + '</td><td>' + value + ' </td><td>' +
                    '<button type="button" class="btn btn-primary btn-sm remove-client" key="' + key + '">' +
                    '<icon class="glyphicon glyphicon-remove"></icon></button></td></tr>';
                jQuery('#pairs-client > tbody').append(pairHtml);
                jQuery(".remove-client").click(removePair);
            }
        );
    };

    /**
     * la fonction enlève le site de l'annuaire
     *
     * @param event click
     */
    var removePair = function(event) {
        var key = event.target.attributes.getNamedItem("key").value;
        annuaire.remove(key);
        showPairs();
        jQuery("#key-client").focus();
    };

    /**
     * Crée un nouveau site dans l'annuaire
     */
    jQuery("#addPair").click(function() {
        var key = jQuery("#key-client").val(),
            value = jQuery("#value-client").val();

        annuaire.bind(key, value);
        jQuery("#key-client").val("").focus();
        jQuery("#value-client").val("");

        showPairs();
    });
});