/**
 * Created by amaia.nazabal on 1/26/17.
 */

'use strict';

jQuery(function() {
    Interface.getAll();

});

/**
 * Supprime le site selectionné.
 *
 * @param key le nom du site
 */
function removeURL (key) {
    Interface.delete(key);
}

/**
 * Ajoute un nouveau site à l'annuaire
 */
jQuery("#addPair-serveur").click(function() {
    var key = jQuery("#key-serveur").val(),
        value = jQuery("#value-serveur").val(),
        tags = jQuery("#tags_serveur").val();

    if(key !="" || value !="" ) {

        Interface.bind(key, value, tags);
    }
});