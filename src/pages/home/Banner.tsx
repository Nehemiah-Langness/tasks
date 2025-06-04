import { faUmbrellaBeach } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatDate } from '../../services/formatDate';
import { useVacation } from './useVacation';

export function Banner() {
    const {onVacation, vacationEnd} = useVacation();

    return onVacation ? (
        <div className='d-flex justify-content-center align-items-center bg-info-subtle text-info-emphasis fs-200 p-3 ff-cursive gap-3'>
            <FontAwesomeIcon flip='horizontal' icon={faUmbrellaBeach} />
            <div className=''>
                On vacation until{' '}
                {formatDate(vacationEnd ?? 0, {
                    date: true,
                    summarize: true,
                })}
            </div>
            <FontAwesomeIcon icon={faUmbrellaBeach} />
        </div>
    ) : null;
}
