import { store } from '../../app/store'
import { usersApiSlice } from '../fields/redux/usersApiSlice';
import { actApiSlice } from '../fields/redux/actApiSlice';
import { dateApiSlice } from '../fields/redux/appApiSlice';
import { campApiSlice } from '../fields/redux/campApiSlice';
import { comtApiSlice } from '../fields/redux/comtApiSlice';
import { costApiSlice } from '../fields/redux/costApiSlice';
import { cropApiSlice } from '../fields/redux/cropApiSlice';
import { doseApiSlice } from '../fields/redux/doseApiSlice';
import { itemApiSlice } from '../fields/redux/itemApiSlice';
import { plantApiSlice } from '../fields/redux/plantApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const Prefetch = () => {
    useEffect(() => {
        console.log('subscribing')        
        
        store.dispatch(usersApiSlice.util.prefetch('getUsers', 'usersList', {force: true}))
        store.dispatch(actApiSlice.util.prefetch('getActs', 'actsList', {force: true}))
        store.dispatch(dateApiSlice.util.prefetch('getDates', 'datesList', {force: true}))
        store.dispatch(campApiSlice.util.prefetch('getCamps', 'campsList', {force: true}))
        store.dispatch(comtApiSlice.util.prefetch('getComts', 'comtsList', {force: true}))
        store.dispatch(costApiSlice.util.prefetch('getCosts', 'cotsList', {force: true}))
         store.dispatch(cropApiSlice.util.prefetch('getCrops', 'cropsList', {force: true}))
         store.dispatch(doseApiSlice.util.prefetch('getDoses', 'dosesList', {force: true}))
        store.dispatch(itemApiSlice.util.prefetch('getItems', 'itemsList', {force: true}))
         store.dispatch(plantApiSlice.util.prefetch('getPlants', 'plantsList', {force: true}))

    }, [])

    return <Outlet />
}
export default Prefetch
