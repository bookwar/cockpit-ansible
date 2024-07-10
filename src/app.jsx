/*
 * This file is part of Cockpit.
 *
 * Copyright (C) 2017 Red Hat, Inc.
 *
 * Cockpit is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation; either version 2.1 of the License, or
 * (at your option) any later version.
 *
 * Cockpit is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Cockpit; If not, see <http://www.gnu.org/licenses/>.
 */

import cockpit from 'cockpit';
import React from 'react';
import { Alert } from "@patternfly/react-core/dist/esm/components/Alert/index.js";
import { Card, CardBody, CardTitle } from "@patternfly/react-core/dist/esm/components/Card/index.js";
import {TreeView, Button} from '@patternfly/react-core';

import {DataList, DataListItem, DataListItemRow, DataListItemCells, DataListCell} from '@patternfly/react-core';

const _ = cockpit.gettext;

export const InventoryListItem = (props) =>
  <DataListItem aria-labelledby="inventory-list-item">
      <DataListItemRow>
      <DataListItemCells dataListCells={[
		   <DataListCell key="primary {props.host} content">
		      <span id="inventory-list-item">Host {props.host}</span>
		   </DataListCell>,
		   <DataListCell key="secondary {props.host} content"> Host description
		 	   </DataListCell>
		   ]}
	    />
      </DataListItemRow>
  </DataListItem>;

export const InventoryList = (props) =>
<DataList aria-label="Ansible Inventory List">
    {props.hosts.map(host => <InventoryListItem host={host} />)}
</DataList>;

export class Application extends React.Component {
    constructor() {
        super();
        this.state = {
	    inventory: {},
	    hosts: [],
	};

	cockpit.spawn(['ansible-inventory', '-i', '/tmp/hosts', '--list']).then(data => {
	    const inventory = JSON.parse(data)

	    // Ansible Inventory produces the JSON data with the groups hierarchy.
	    // Here is the messy way to get the simple list of unique hostnames from that data.
	    
	    const hosts = [...new Set(Object.values(inventory).reduce(
		(accumulator, currentValue) => accumulator.concat(currentValue["hosts"]),
		[],))].filter(element => {
		    return element !== undefined;
		});
 	    
	    this.setState({ inventory: inventory, hosts: hosts});
	});
	
    }

    render() {
        return (
            <Card>
                <CardTitle>Ansible Inventory</CardTitle>
                <CardBody>
		    <InventoryList hosts={this.state.hosts} />    
                </CardBody>
            </Card>
        );
    }
}
