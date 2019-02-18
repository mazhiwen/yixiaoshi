import localforage from 'localforage';
import {contextPath} from 'configs';

localforage.config({
    driver: localforage.LOCALSTORAGE,
    name: contextPath
});


export default localforage;