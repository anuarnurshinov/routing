import { Outlet, useLoaderData, Form, redirect, NavLink, useNavigation, useSubmit } from "react-router-dom";
import { getContacts, createContact } from '../contacts'
import { useEffect } from "react";

export const action = async () => {
    const contact = await createContact()
    return redirect(`/contacts/${contact.id}/edit`)
}

export const loader = async ({ request }) => {
    const url = new URL(request.url) // получаем URL объект
    const q = url.searchParams.get('search') // получаем текст поиска
    const contacts = await getContacts(q)
    return { contacts, q }
}

export default function Root() {
    const navigation = useNavigation()
    const { contacts, q } = useLoaderData()
    useEffect(() => {
        document.getElementById('q').value = q;
    }, [q])
    const submit = useSubmit()
    const searching =
        navigation.location &&
        new URLSearchParams(navigation.location.search).has(
            "q"
        )
    return (
        <>
            <div id="sidebar">
                <h1>React Router Contacts</h1>
                <div>
                    <Form id="search-form" role="search">
                        <input
                            id="q"
                            aria-label="Search contacts"
                            placeholder="Search"
                            type="search"
                            name="q"
                            defaultValue={q}
                            className={searching ? 'loading' : ''}
                            onChange={(event) => {
                                submit(event.currentTarget.form, {
                                    replace: !isFirstSearch,
                                })
                            }}
                        />
                        <div
                            id="search-spinner"
                            aria-hidden
                            hidden={!searching}
                        />
                        <div
                            className="sr-only"
                            aria-live="polite"
                        ></div>
                    </Form>
                    <Form method="post">
                        <button type="submit">New</button>
                    </Form>
                </div>
                <nav>
                    {contacts.length ? (
                        <ul>
                            {contacts.map((contact) => (
                                <li key={contact.id}>
                                    <NavLink to={`contacts/${contact.id}`}
                                        className={({ isActive, isPending }) => isActive ? 'active' : isPending ? 'pending' : ''
                                        }>
                                        {contact.first || contact.last ? (
                                            <>
                                                {contact.first} {contact.last}
                                            </>
                                        ) : (
                                            <i>No Name</i>
                                        )}{" "}
                                        {contact.favorite && <span>★</span>}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>
                            <i>No contacts</i>
                        </p>
                    )}
                </nav>
            </div>
            <div id="detail"
                className={navigation.state === 'loading' ? 'loading' : ''}>
                <Outlet />
            </div>
        </>
    );
}