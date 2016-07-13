#Flow Manager UI

## Solution Notes - Flow Manager UI

- [Karthic Jayaraman](https://github.com/karthicjayaraman) 
- [Hariharaselvam Balasubramanian](https://github.com/hariharaselvam) 
- [Dimpu Sagar N](https://github.com/dimpusagar91) 
- [Manoj Prashant K](https://github.com/manojasm)
- [Narender Kumar](https://github.com/nkkize) 
 

  

## Reading Real-time Information On Switches

It is difficult to read the real-time information on flows installed on the switches managed by a controller. In addition, it is difficult to efficiently manage the Flow of a switch. 


## Solution Approach

Have developed the User Interface to represent the switch’s data in a legible and readable tables. The UI interface is enhanced with several functionalities like View, Search, and Delete in the interface. 
 

  ![Flow Manager UI](https://github.com/geethabg/Images/blob/master/FlowManager.png)
  
  
## Key functionalities
- Manage flows ( add, edit and delete flows )
- Graphical and Tabulated view of Flows with pagination
- Manage users
- Secure API ( re-usable in other application )
 
## Deployment Details


**Pre-requisites**:  Ubuntu OS,Python2.7,Nginx, and UWSGI



1. Clone the code from https://github.com/onfsdn/flow_manager.git
2. Copy the nginx configuration file from the flow_manager/sdn/default to /etc/nginx/sites-available/default
3. Restart the nginx server
4. Run the following uwsgi command from flow_manager/src/ directory.

	sudo uwsgi –-socket :5000 -–wsgi-file run.py --master -–processes 5 -–threads 5 -–callable app




