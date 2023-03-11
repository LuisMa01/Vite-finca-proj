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
        const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate())
        const acts = store.dispatch(actApiSlice.endpoints.getActs.initiate())
        const dates = store.dispatch(dateApiSlice.endpoints.getDates.initiate())
        const camps = store.dispatch(campApiSlice.endpoints.getCamps.initiate())
        const comts = store.dispatch(comtApiSlice.endpoints.getComts.initiate())
        const costs = store.dispatch(costApiSlice.endpoints.getCosts.initiate())
        const crops = store.dispatch(cropApiSlice.endpoints.getCrops.initiate())
        const doses = store.dispatch(doseApiSlice.endpoints.getDoses.initiate())
        const items = store.dispatch(itemApiSlice.endpoints.getItems.initiate())
        const plants = store.dispatch(plantApiSlice.endpoints.getPlants.initiate())



        return () => {
            console.log('unsubscribing')
            users.unsubscribe()
            acts.unsubscribe()
            dates.unsubscribe()
            camps.unsubscribe()
            comts.unsubscribe()
            costs.unsubscribe()
            crops.unsubscribe()
            doses.unsubscribe()
            items.unsubscribe()
            plants.unsubscribe()
        }
    }, [])

    return <Outlet />
}
export default Prefetch
