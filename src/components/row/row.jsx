import React from "react";
import './row.css'
const Row = ({left, right}) => {
    return (
        <div className={"row"}>
            <div className={"row-child-left"}>
                {left}
            </div>
            <div className={"row-child-right"}>
                {right}
            </div>
        </div>
    )
};

export default Row;