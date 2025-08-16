import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useRoom } from "../../entities/room";
import { ROUTES } from "../../shared/config/routes";

export const AddRoomPage = () => {
    const { roomHash } = useParams();
    const navigate = useNavigate()
    const { addRoomFromHash } = useRoom();

    useEffect(() => {
        if (addRoomFromHash(roomHash)) {
            navigate(ROUTES.home)
        }
    }, [roomHash])


    return (
        <>
            <div>
                Erro!
            </div>
        </>
    )
}