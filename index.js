const API = (() => {
    const URL = "http://localhost:3000/events";
  
    const getEvents = () => {
      return fetch(URL).then((res) => res.json());
    };
  
    const postEvent = (newEvent) => {
      return fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      }).then((res) => res.json());
    };
  
    const putEvent = (id, newEvent) => {
        return fetch(`${URL}/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newEvent),
        }).then((res) => res.json());
      };

    const removeEvent = (id) => {
      return fetch(`${URL}/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .catch(console.log);
    };
  
    return {
      getEvents,
      postEvent,
      putEvent,
      removeEvent,
    };
  })();
 
class EventModel {

    #events;
  constructor() {
    this.#events = [];
  }
  fetchEvents(){
    return API.getEvents().then(events=>{
      this.setEvents(events);
      return events;
    })
  }

  setEvents(events) {
    this.#events = events;
  }

  getEvents() {
    return this.#events;
  }

  addEvent(newEvent) {
    return API.postEvent(newEvent).then((addedEvent) => {
      this.#events.push(addedEvent);
      return addedEvent;
    });
  }

  editEvent(id, newEvent) {
    return API.putEvent(id, newEvent).then((editedEvent) => {
        this.#events[id] = editedEvent;
        return editedEvent;
      });
  }

  removeEvent(id) {
    return API.removeEvent(id).then((removedEvent) => {
      this.#events = this.#events.filter((event) => event.id !== +id);
        console.log(id);
        console.log(this.#events)
      return removedEvent;
    });
  }

}

class EventView {
    constructor() {
        this.eventForm = document.querySelector("#event-form");
        this.eventConfirm = document.querySelector(".event__btn-confirm");
        this.eventList = document.querySelector("#events-list");
      }
    
      renderEvents(events) {
        events.forEach((event) => {
            
          this.appendEvent(event);
        });
      }
    //   editEventElem(domID, obj){
    //     const element = document.getElementById(domID);
    //     element.querySelector(".event__name");
    //   }
      removeEventElem(domID){
        const element = document.getElementById(domID);
        element.remove()
      }

      appendForm() {
        const eventElem = document.createElement("tr");
        eventElem.classList.add("event-input");
    
        const eventTaskElem = document.createElement("td");
        eventTaskElem.classList.add("event__name");
        const textInput = document.createElement("input");
        textInput.setAttribute("type", "text");
        eventTaskElem.append(textInput);

        const eventDateStart = document.createElement("td");
        eventDateStart.classList.add("event__start");
        const dateStartInput = document.createElement("input");
        dateStartInput.setAttribute("type", "date");
        eventDateStart.append(dateStartInput);

        const eventDateEnd = document.createElement("td");
        eventDateEnd.classList.add("event__end");
        const dateEndInput = document.createElement("input");
        dateEndInput.setAttribute("type", "date");
        eventDateEnd.append(dateEndInput);
    
        const eventActions = document.createElement("td");
        eventActions.classList.add("event__actions");
    
        const editEvent = document.createElement("button");
        editEvent.textContent = "CONFIRM";
        editEvent.classList.add("event__btn-confirm");
        const deleteEvent = document.createElement("button");
        deleteEvent.textContent = "CANCEL";
        deleteEvent.classList.add("event__btn-cancel");

        eventActions.append(editEvent, deleteEvent);
        
    
        eventElem.append(eventTaskElem, eventDateStart, eventDateEnd, eventActions);
        this.eventList.append(eventElem);
      }
    
      appendEvent(event) {
        const eventElem = document.createElement("tr");
        eventElem.classList.add("event");
        eventElem.setAttribute("id", "event"+event.id);
    
        const eventTaskElem = document.createElement("td");
        eventTaskElem.classList.add("event__name");
        eventTaskElem.textContent = event.eventName;

        const eventDateStart = document.createElement("td");
        eventDateStart.classList.add("event__start");
        eventDateStart.textContent = event.startDate;

        const eventDateEnd = document.createElement("td");
        eventDateEnd.classList.add("event__end");
        eventDateEnd.textContent = event.endDate;
    
        const eventActions = document.createElement("td");
        eventActions.classList.add("event__actions");
    
        const editEvent = document.createElement("button");
        editEvent.textContent = "EDIT";
        editEvent.classList.add("event__btn-edit");
        const deleteEvent = document.createElement("button");
        deleteEvent.textContent = "DELETE";
        deleteEvent.classList.add("event__btn-delete");

        eventActions.append(editEvent, deleteEvent);
        
    
        eventElem.append(eventTaskElem, eventDateStart, eventDateEnd, eventActions);
        this.eventList.append(eventElem);
    
      }
}
class EventController {
    constructor(view, model) {
        this.view = view;
        this.model = model;
        this.initialize();
      }
    
      initialize() {
        this.model.fetchEvents();
        this.setUpEvents();
        
        this.model.fetchEvents().then(events=>{
            
          this.view.renderEvents(events);
        })
      }
    
      setUpEvents() {
        this.addEventForm();
       this.editFormEvent();
     this.setUpRemoveEvent();
      }

        addEventForm() {
            
            

            
            this.view.eventForm.addEventListener("click", (e) => {
                if(this.view.eventForm.classList.contains('active')){
                }else{
                    e.preventDefault();
                    this.view.appendForm();
                    this.view.eventForm.classList.add("active");
                    this.setUpFormEvent();
                    this.cancelFormEvent()
                }
                     
                    });
                 
        }
    
      setUpFormEvent() {
        document.querySelector(".event__btn-confirm").addEventListener("click", (e) => {
          e.preventDefault();
          const name = document.querySelector(".event-input").querySelector(".event__name").querySelector("input").value;
          const dateStart = document.querySelector(".event-input").querySelector(".event__start").querySelector("input").value;
          const dateEnd = document.querySelector(".event-input").querySelector(".event__end").querySelector("input").value;
          if(name =='' || dateStart=='' || dateEnd==''){
            alert('Input is not valid!')
          }else{
            this.model
                .addEvent({
                    eventName: name,
                    startDate: dateStart,
                    endDate: dateEnd,
                })
                .then((data) => {
                  this.view.appendEvent(data);
                  document.querySelector(".event-input").remove();
                  this.view.eventForm.classList = "";
                });
          }
        });
      }

      cancelFormEvent() {
        document.querySelector(".event__btn-cancel").addEventListener("click", (e) => {
            e.preventDefault();
            document.querySelector(".event-input").remove();
            this.view.eventForm.classList = "";

        });
      }
      editFormEvent() {
        this.view.eventList.addEventListener("click", (e) => {
            if (e.target.classList.contains("event__btn-edit")) {
                const domID = e.target.parentNode.parentNode.getAttribute("id");
                const id = domID.substring(5);
                this.model.fetchEvents().then(events=>{
                    console.log(events)
                  })
                this.model.editEvent(id, obj).then((data) => {
                    this.view.editEventElem(domID , obj)
                  });
            }
      
      
          });
      }
    
      setUpRemoveEvent() {
        this.view.eventList.addEventListener("click", (e) => {
          if (e.target.classList.contains("event__btn-delete")) {
            const domID = e.target.parentNode.parentNode.getAttribute("id");
            const id = domID.substring(5);
            this.model.removeEvent(id).then((data) => {
              this.view.removeEventElem(domID)
            });
          }
    
    
        });
      }
}

const eventView = new EventView();
const eventModel = new EventModel();
const eventController = new EventController(eventView, eventModel);