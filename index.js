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
        editEvent.innerHTML = `<svg focusable="false" aria-hidden="true" viewBox="-9 5 70 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M21,20V8.414a1,1,0,0,0-.293-.707L16.293,3.293A1,1,0,0,0,15.586,3H4A1,1,0,0,0,3,4V20a1,1,0,0,0,1,1H20A1,1,0,0,0,21,20ZM9,8h4a1,1,0,0,1,0,2H9A1,1,0,0,1,9,8Zm7,11H8V15a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1Z"/></svg>`;
        editEvent.classList.add("event__btn-confirm");
        const deleteEvent = document.createElement("button");
        deleteEvent.innerHTML = `<svg focusable="false" aria-hidden="true" viewBox="-6 5 80 30" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"></path></svg>`;
        deleteEvent.classList.add("event__btn-cancel");

        eventActions.append(editEvent, deleteEvent);
        
    
        eventElem.append(eventTaskElem, eventDateStart, eventDateEnd, eventActions);
        this.eventList.append(eventElem);
      }
      updateForm(domID) {
        const elem = this.eventList.querySelector(`#${domID}`);
        elem.classList.add("edit");
        let name = elem.querySelector(`.event__name`).textContent;
        const textInp = document.createElement("input");
        textInp.setAttribute("type", "text");
        textInp.setAttribute("value", `${name}`);
        elem.querySelector(`.event__name`).textContent = '';
        elem.querySelector(`.event__name`).append(textInp) ;

        let start_date = elem.querySelector(`.event__start`).textContent;
        const startInp = document.createElement("input");
        startInp.setAttribute("type", "date");
        startInp.setAttribute("value", `${start_date}`);
        elem.querySelector(`.event__start`).textContent = '';
        elem.querySelector(`.event__start`).append(startInp) ;

        let end_date = elem.querySelector(`.event__end`).textContent;
        const endInp = document.createElement("input");
        endInp.setAttribute("type", "date");
        endInp.setAttribute("value", `${end_date}`);
        elem.querySelector(`.event__end`).textContent = '';
        elem.querySelector(`.event__end`).append(endInp) ;

        const edit_action = elem.querySelector(`.event__actions`);
        edit_action.textContent = '';
        const editEvent = document.createElement("button");
        editEvent.innerHTML = `<svg focusable="false" aria-hidden="true" viewBox="-9 5 70 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M21,20V8.414a1,1,0,0,0-.293-.707L16.293,3.293A1,1,0,0,0,15.586,3H4A1,1,0,0,0,3,4V20a1,1,0,0,0,1,1H20A1,1,0,0,0,21,20ZM9,8h4a1,1,0,0,1,0,2H9A1,1,0,0,1,9,8Zm7,11H8V15a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1Z"/></svg>`;
        editEvent.classList.add("event__btn-confirm");
        const deleteEvent = document.createElement("button");
        deleteEvent.innerHTML = `<svg focusable="false" aria-hidden="true" viewBox="-6 5 80 30" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"></path></svg>`;
        deleteEvent.classList.add("event__btn-cancel");

        edit_action.append(editEvent, deleteEvent);
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
        editEvent.innerHTML = `<svg focusable="false" aria-hidden="true" viewBox="-9 5 70 20" data-testid="EditIcon" aria-label="fontSize small"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 
        17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>`;
        editEvent.classList.add("event__btn-edit");
        const deleteEvent = document.createElement("button");
        deleteEvent.innerHTML = `<svg focusable="false" aria-hidden="true" viewBox="-9 5 70 20" 
        data-testid="DeleteIcon" aria-label="fontSize small"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 
        0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>`;
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
          const elem = document.querySelector(".event-input");
          const name = elem.querySelector(".event__name").querySelector("input").value;
          const dateStart = elem.querySelector(".event__start").querySelector("input").value;
          const dateEnd = elem.querySelector(".event__end").querySelector("input").value;
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
                console.log(domID)
            const id = domID.substring(5);
               this.view.updateForm(domID);
               this.setUpEditEvent(id);
               this.cancelEditEvent();
            }
      
      
          });
      }
      setUpEditEvent(id) {
        document.querySelector(".edit").querySelector(".event__btn-confirm").addEventListener("click", (e) => {
          e.preventDefault();
          const elem = document.querySelector(".edit");
          const name = elem.querySelector(".event__name").querySelector("input").value;
          const dateStart = elem.querySelector(".event__start").querySelector("input").value;
          const dateEnd = elem.querySelector(".event__end").querySelector("input").value;
          if(name =='' || dateStart=='' || dateEnd==''){
            alert('Input is not valid!')
          }else{
            console.log("ok")
            this.model
            .editEvent(id, {
                eventName: name,
                startDate: dateStart,
                endDate: dateEnd,
            })
            .then((data) => {
                window.location.reload();
            });
            
          }
        });
      }

      cancelEditEvent() {
        document.querySelector(".edit").querySelector(".event__btn-cancel").addEventListener("click", (e) => {
            e.preventDefault();
            window.location.reload();

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