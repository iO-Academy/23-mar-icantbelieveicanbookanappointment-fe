import BASE_URL from "../../settings"
import React, { useEffect, useState } from "react"
import './_appointmentSchedule.scss'
import Modal from "../Modal";

const AppointmentSchedule = ({ appointments, selectedDate }) => {
    const [patientNames, setPatientNames] = useState({})

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const closeModal = () => {
        setModalOpen(false);
        setSelectedAppointment(null);
    };

    useEffect(() => {
        const fetchPatientNames = async () => {
            const promises = appointments.map(appointment =>
                fetch(`${BASE_URL}patient/${appointment.patientId}`)
                    .then(response => response.json())
                    .then((data) => {
                        console.log(data)
                return { id: appointment.patientId,
                        name: `${data.data.first_name} ${data.data.last_name}`
                    }})
            )

            const resolvedPatientNames = await Promise.all(promises)

            const patientNameMap = resolvedPatientNames.reduce(
                (map, patient) => ({...map, [patient.id]: patient.name}),
                {}
            )

            setPatientNames(patientNameMap)
        }

        fetchPatientNames()
    }, [appointments])


    const appointmentTimes = [9, 10, 11, 12, 13, 14, 15, 16]
    const sortedAppointments = appointments.sort((a, b) => a.time - b.time)

    return (
        <div className="appointment-schedule">
            {appointmentTimes.map((time) => {
                const appointment = sortedAppointments.find((app) => app.time === time);

                return (
                    <div
                        key={time}
                        className="appointment"
                        onClick={() => {
                            setSelectedAppointment(appointment);
                            appointment ? setModalOpen(true): setModalOpen(false)
                        }}
                    >
                        <div className="time">{time}:00</div>
                        <div className={`patient-name ${appointment ? "patient-hover": ""}`}>
                            {appointment ? patientNames[appointment.patientId] || "Loading..." : ""}
                        </div>
                    </div>
                );
            })}
            {modalOpen && (
                <Modal
                    data={selectedAppointment}
                    closeModal={closeModal}
                    patientName={patientNames[selectedAppointment.patientId]}
                    selectedDate={selectedDate}
                />
            )}
        </div>
    );
}

    export default AppointmentSchedule
