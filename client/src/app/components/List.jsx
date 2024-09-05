"use client";
import { ListItem } from "./ListItem";

export default (props) => {
    console.log(props)

    return (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {
                props.items.map((u, i) => {
                    return <ListItem key={i} id={i} item={u} />
                })}
        </ul>
    );
}