import React from "react"
import ReImage from "../../images/return.svg"
import "../../styles/editar-campos.css"
import { Link, useParams } from "react-router-dom"
import { useGetUsersQuery } from "./redux/usersApiSlice";

const ActInformacion = () => {
    const{ id } = useParams()
    console.log(id);

    const { user } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            user: data?.entities[id]
        }),
    })

    console.log(user);
    return(
        <>
        </>
    )
}

export default ActInformacion