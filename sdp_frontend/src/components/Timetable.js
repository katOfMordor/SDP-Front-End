import React, {Component} from 'react'
import {Table, ButtonToolbar} from 'react-bootstrap';
import {PageHeader} from 'react-bootstrap';
import ReactHTMLTableToExcel from 'react-html-table-to-excel'
import {Button} from 'react-bootstrap'
import $ from 'jquery'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = BigCalendar.momentLocalizer(moment)
let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])

let url = 'http://youthleague.co'
//let url = 'http://localhost'
var $arr = [];
var lengthTimetable = 0;
class Timetable extends Component{

    constructor(props){
        super(props)
        this.state={
          studentnumber:"",
          coursecode:"",
          data:[],
          timetable: "",
          neighbor:false,
          safe:"",
          student:false,
          save:[],
          new_data:[],
          delCourses:[],        }
        this.showMainTim = this.showMainTim.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.getSummary = this.getSummary.bind(this);
        this.addRow = this.addRow.bind(this);
      //  this.delRow=this.delRow.bind(this);
    }
    
    showMainTim(){
        this.setState({
            neighbor:false,
            student:false
        })
    }

    onInputChange(e){
        this.setState({
            studentnumber:e.target.value
        })
    }

    sendStdnum = function(){
        let _self = this;
        var stdnum = document.getElementById("stdNum")
        console.log(stdnum.value)

        fetch(`${url}:3456/student`,{
            method:"POST",
            body:JSON.stringify({studentnumber:stdnum.value
          }),
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
        })
        .then(function(response){
            return response.json()
        })
        .then(function(response){
            if(response.errorType){
                console.log(response)
                alert("Could not generate student timetable. please try again")
            }else if(response.length === 0){
                console.log(response)
                alert("Student does not exist. Enter new student number")
            }else{
                let timetable = response;
                let date = new Date();
                let h=0;
                for(let i = 0; i<timetable.length; i++){
                        console.log(timetable[i]);
                        let a = new Date(timetable[i].start)
                        let b = new Date(timetable[i].end)
                        if(date.toDateString() === a.toDateString()){
                            h = h+2;
                        }else{
                            h=0;
                            date = a;
                        }
                        timetable[i].start = new Date(a.setTime(a.getTime() + (h*60*60*1000)))
                        timetable[i].end = new Date(b.setTime(b.getTime() + (h*60*60*1000)))
    
                }
                console.log(response)
                _self.setState({
                    timetable:timetable,
                    student:true,
                    neighbor:false
                })
            }
        })
        .catch(function(err){
            console.log(err)
        })
    }.bind(this)

    getNeighbor= function(){
        let _self = this;
        var courseN = document.getElementById("courseN")
      
        fetch(`${url}:3456/neighbors`,{
            method:"POST",
            body:JSON.stringify({coursecode:courseN.value
        }),
          headers: {
              "Content-Type": "application/json; charset=utf-8",
          },
        })
        .then(function(response){
            return response.json()
        })
        .then(function(response){
            let timetable = response;
            let date = new Date();
            let h=0;
            for(let i = 0; i<timetable.length; i++){
                    console.log(timetable[i]);
                    let a = new Date(timetable[i].start)
                    let b = new Date(timetable[i].end)
                    if(date.toDateString() === a.toDateString()){
                        h = h+2;
                    }else{
                        h=0;
                        date = a;
                    }
                    timetable[i].start = new Date(a.setTime(a.getTime() + (h*60*60*1000)))
                    timetable[i].end = new Date(b.setTime(b.getTime() + (h*60*60*1000)))

            }
            console.log(response);
            _self.setState({
                timetable:timetable,
                neighbor:true,                    
                student:false    
            })
        })
        .catch(function(err){
            console.log(err)
        })
    }.bind(this)
   
   
    search = function (){
      $("#myInput").on("input",function(){
  
          var str = $('#myInput').val();
          var strary = str.split(':');
  
          $("table").find("tr").slice(1).each(function (index) {
              var text = $.trim($(this).text());
              for (var i = 0; i < strary.length; i++) {
               console.log("%s:%s", text, strary[i]);
                  var tempStr;
                  tempStr = strary[i].replace("(", "\\(");
                  tempStr = tempStr.replace(")", "\\)");               
                  var regex = new RegExp(".*" + tempStr + ".*", "gi");
                  $(this).toggle(regex.test(text));
                console.log(regex.test(text));
                if (regex.test(text)) break;
              }
          });
      });
  
    }
     
    getSummary =function(){
        let _self = this;
        let arr = this.props.location.state
        this.props.history.push({

            pathname:"./summary",
            state:arr[arr.length-1]

        })
    }

        
    getModified =function(){
        let _self = this;
        let arr = this.props.location.state
        _self.props.history.push({
            pathname:"./viewModified",
            state:arr[arr.length-1]
        })
    }




    saveTimetable = function(){
        
     let added = this.state.new_data
     let added2 = this.state.delCourses
        fetch(`${url}:3456/save`,{
            method:"POST",
            body:JSON.stringify({save:added,del:added2
            }),
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
        }) .then(function(response){
            console.log(response);
            alert("Successfully saved timetable!!");
     })
        .catch(function(err){
            console.log(err)
        })

}.bind(this);

addRow(){
    let _self = this;
    let temp = [];
    console.log("Fireflies");
    //add new row
    let newRow = document.getElementById('sessions').insertRow().innerHTML='<tr ><td class="new_session" contenteditable="true">New session</td><td class="new_date" contenteditable="true" color="green">Click Me!</td><td class="new_course" contenteditable="true">New Course</td><td><span class="table-ok glyphicon glyphicon-ok"></span></td></tr>';
    $("#sessions").on('click.input','input',function(event){
        event.stopPropagation();
    })

    $("#sessions").on('click.td','.new_date',function(){
        var $td = $(this);
        var text = $(this).html();
        var $input = $('<input type="date" class="nd" value="Insert Date Here" required pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" />');
        $td.html('').append($input);
    })
 $(".table-ok").click(function () {
       // alert(event.target.textContent);
       var $row = $(this).closest('tr');
       var $newSession = $row.find('.new_session').text();
       var $newDate = $row.find('.nd')[0].value;
       var $newCourse = $row.find('.new_course').text();
       var $arr = [];
       $arr.push($newSession);
       $arr.push($newDate);
       $arr.push($newCourse);
       temp.push($arr);
      console.log($arr)
      _self.setState({
        new_data:temp
    })
    $('td:nth-child(4)').fadeOut(500);
   
    });
}



 render(){

    let _del = this;
    $('.table-remove').click(function () {
    $(this).parents('tr').detach();
    var $row = $(this).closest('tr');
    var $delCourse = $row.find('.new_course').text();
    $arr.push($delCourse);
    _del.setState({
        delCourses:$arr
    })
    console.log($arr)
    });
      
   
        var id = getCookie("id");
        if (id === "") {
            this.props.history.push({
                pathname:'/login'
            })
        }

        if(this.props.location.state && !this.state.timetable){
            let timetable = this.props.location.state;
            let date = new Date();
            let h=0;
            for(let i = 0; i<timetable.length; i++){
                  //  console.log(timetable[i]);
                    let a = new Date(timetable[i].start)
                    let b = new Date(timetable[i].end)
                    if(date.toDateString() === a.toDateString()){
                        h = h+2;
                    }else{
                        h=0;
                        date = a;
                    }
                    timetable[i].start = new Date(a.setTime(a.getTime() + (h*60*60*1000)))
                    timetable[i].end = new Date(b.setTime(b.getTime() + (h*60*60*1000)))

            }
         //   console.log(timetable);
            lengthTimetable = timetable.length-1; 
            this.setState({
                timetable:timetable
            })
        }
        return(
            <div>
                <pre> 
                    <PageHeader>
                        <h1 align='center'>Generated timetable with sessions</h1>
                    </PageHeader>
                </pre>
                <div className='row'>
                    <div class='col-lg-5'>
                            <div style={{marginLeft:"25%"}}align='center'>
                                <ButtonToolbar align="center">
                                <ReactHTMLTableToExcel id="test" className="btn btn-primary" table="sessions" filename="Sessions table" sheet="sessions" buttonText="Download as XLS"/>
                                <Button bsStyle='primary' id="saveMe"  onClick={this.saveTimetable}>Save Timetable</Button>
                                </ButtonToolbar>
                            </div> 
                            <p></p>
                            <div align='center'>
                                <label>Search for multiple courses by adding a ":" after course name</label> 
                            </div>
                            <div class ="form-group has-feedback has-search" align='center'>
                                <span class="glyphicon glyphicon-search form-control-feedback" style={{marginRight:'22%'}}></span>
                                <input class="glyphicon glyphicon-search form-control-feedback" style={{width:'400px'}} type="text" id="myInput"  onKeyUp= {this.search} placeholder="Search for courses.." title="Type a course" class="form-control"/>
                            </div>
                            <p></p>
                            <p align="right" className="mainTim" >Modified Timetable</p>
                            {
                                (this.state.neighbor && <p align="right" className="mainTim" onClick={this.showMainTim}>Main Timetable</p>)|| (this.state.student && <p align="right" className="mainTim" onClick={this.showMainTim}>Main Timetable</p>)
                            }
                            {
                            !this.state.neighbor && !this.state.student && <p align="right" className="mainTim" onClick={this.getSummary}>Summary Data</p>
                            
                           
                            
                            }
                              {this.state.neighbor || this.state.student?
                            <Table  class="table" id ="sessions" align='center' bordered striped condensed hover  >
                                <thead>                   
                                    <tr className="tableheading">
                                        <th style = {{backgoundColor:"#e5e5e5"}}>Sessions</th>
                                        <th style = {{backgoundColor:"#e5e5e5"}}>Date</th>
                                        <th style = {{backgoundColor:"#e5e5e5"}}>Course Name</th> 
                                        {
                                            this.state.neighbor?<th style = {{backgoundColor:"#e5e5e5"}}>#students in each course</th>:null
                                        }
                                        {
                                            this.state.neighbor?<th style = {{backgoundColor:"#e5e5e5"}}>% shared/main</th>:null
                                        }
                                        {
                                            this.state.neighbor?<th style = {{backgoundColor:"#e5e5e5"}}>% shared/neighbor</th>:null
                                        }
                                      
                                        
                                    </tr>
                                </thead>
                              
                                      
                                {this.state.timetable? this.state.timetable.map((x, i)=>{
                                   // console.log(i);
                                   // console.log(lengthTimetable);
                                    if(i == lengthTimetable){
                                        return
                                    }
                                //   console.log("This is i " + x.session)
                                  
                                  let style={}

                                  let even = {
                                    backgroundColor: "#e5e5e5",
                                     }

                                  let odd = {
                                    backgroundColor: "#f1f8ff",
                                
                                  }

                                  var num = parseInt(x.session)

                                  if(num %2 == 0){
                                      style = even;
                                  }

                                  else{style = odd}
                                   return(
                                        <tbody>
                                            <tr>
                                                {console.log(typeof(x.start))}
                                                <td style={style}>{x.session}</td>
                                                {this.state.neighbor || this.state.student?
                                                <td style = {style}>{x.resource}</td>:null
                                                }
                                                {this.state.neighbor || this.state.student?
                                                <td style = {style} >{x.title}</td>:null
                                                }
                                                {this.state.neighbor?
                                                <td style = {style}>{x.size}</td>:null
                                                }
                                                {this.state.neighbor?
                                                <td style = {style}>{x.percentageBig}</td>
                                                :null
                                                }
                                                {this.state.neighbor?
                                                <td style = {style}>{x.percentageSub}</td>
                                                :null
                                                }
                                                
                                               </tr>
                                        </tbody>
                                    )} ) : <div></div>
                                }
                            
                            </Table>:
                              
                            <Table  class="table" id ="sessions" align='center' bordered striped condensed hover  >
                                <thead>                   
                                    <tr className="tableheading">
                                        <th style = {{backgoundColor:"#e5e5e5"}}>Sessions</th>
                                        <th style = {{backgoundColor:"#e5e5e5"}}>Dates</th> 
                                        <th style = {{backgoundColor:"#e5e5e5"}}>Courses</th>
                                        <th>
                                            <span id="add-btn" onClick={this.addRow} class="table-add glyphicon glyphicon-plus"></span>
                                        </th>
                                    </tr>
                                </thead>
                              
                                      
                                {this.props.location.state? this.props.location.state.map((x, i)=>{
                                  //  console.log(i);
                                    //console.log(lengthTimetable);
                                    if(i == lengthTimetable){
                                        return
                                    }
                                //   console.log("This is i " + x.resource[0].session)
                                  
                                  let style={}

                                  let even = {
                                    backgroundColor: "#e5e5e5",
                                 }

                                  let odd = {
                                    backgroundColor: "#f1f8ff",
                                
                                  }

                                  var num = parseInt(x.resource[0].session)

                                  if(num %2 == 0){
                                      style = even;
                                  }

                                  else{style = odd;}
                                   return(
                                            <tbody>
                                            <tr>
                                                {console.log(typeof(x.start))}
                                                <td contentEditable='false' style = {style} class="the_session" >{x.resource[0].session}</td>
                                                <td contentEditable='false'style = {style} class="the_date">{x.data[0]}</td>
                                                <td contentEditable='false'style = {style} class="new_course">{x.subject + " "}</td>
                                                {/* <td>
                                                    <span class="table-remove glyphicon glyphicon-remove"></span>
                                                </td> */}
                                            </tr>
                                        </tbody>
                                    )} ) : <div></div>
                                }
                            
                            </Table>
                            }
                            
                    </div>

                    <div className="col-lg-7">
                        <div className="timetable row" style={{marginBottom:25}}>
                            <div className="col-lg-6">
                                <input type="text" name="studentNum"  id = "stdNum" placeholder="Enter student number" onChange={this.onInputChange} style={{marginRight:10}}/>
                                <br/>
                                <br/>
                                {
                                    this.state.studentnumber===""?<Button bsStyle="success" onClick={this.sendStdnum} style={{float:'right', marginRight:60}} disabled>Generate timetable</Button>:<Button bsStyle="success" onClick={this.sendStdnum} style={{float:'right', marginRight:60}}>Generate timetable</Button>
                                }
                                
                            </div>
                             
                           <div className="col-lg-6">
                                <select style={{marginLeft:10}} id="courseN">
                                        <input type="text" placeholder="Search.." id="myInput" onkeyup="filterFunction()"/>
                                    
                                        {this.props.location.checkedStuff != "" ? this.props.location.checkedStuff.map((x)=>{
                                            return(
                                                <option value={x}>{x}</option>
                                            )}) : <div></div>
                                        }
                                </select>
                                <br/>
                                <br/>
                                <Button bsStyle="success" onClick={this.getNeighbor} style={{float:'right', marginRight:50}}>Check neighbors</Button>
                           </div>
                            
                        </div>
                        
                        <div id style={{width:'50vw', height:'100vh'}}>
                            
                            <BigCalendar
                                localizer={localizer}
                                events={(this.state.timetable || this.state.data)}
                                views={allViews}
                                step={60}
                                showMultiDayTimes
                                startAccessor="start"
                                endAccessor="end"
                            />
                        </div>
                        
                    </div>
                </div>
            </div>                
        )
    }
          
    componentDidMount(){
        let schedule = this.props.location.state;
        console.log(schedule);

        //   for(let i = 0; i<schedule.length; i++){
        //         let a = moment(schedule[i].start)
        //         let b = moment(schedule[i].end)
        //         schedule[i].start = a
        //         schedule[i].end = b
        //     }
        //     console.log(schedule);
            
        //     this.setState({
        //         timetable: schedule
        //     })
        let _self = this;
        fetch(`${url}:3456/display/courses`)
        .then(function(res){
            return res.json()
        })
        .then(function(response){
            console.log(response)
            _self.setState({
                data:response,
                states:response
            })
        })
        .catch(function(err){
            console.log(err)
        })
    }

}
    
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

export default Timetable
  