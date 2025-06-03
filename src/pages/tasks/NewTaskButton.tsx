import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEditTasks } from '../../contexts/edit-tasks/useEditTasks';

export function NewTaskButton() {
    const { create } = useEditTasks();

    return (
        <button className='btn btn-link link-success text-decoration-none d-flex align-items-center gap-2 text-nowrap' onClick={() => create()}>
            <FontAwesomeIcon style={{ fontSize: '1.1em' }} icon={faPlusCircle} /> New Task
        </button>
    );
}
