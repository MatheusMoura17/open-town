import { useUser } from "../../entities/user"

export const PeeringPage = () => {
    const { user, createUser } = useUser();

    const register = (formData: FormData) => {
        const displayName = formData.get("displayName");

        if (!displayName) return;

        createUser(displayName as string);
    }

    const info = () => (
        <ul>
            <li>{user?.id}</li>
            <li>{user?.displayName}</li>
        </ul>
    )

    const registerForm = () => (
        <form action={register}>
            <input type="text" name="displayName" placeholder="Informe seu nome" />
            <button type="submit">Registrar</button>
        </form>
    )

    return (
        <>
            {user ? info() : registerForm()}
        </>
    )
}