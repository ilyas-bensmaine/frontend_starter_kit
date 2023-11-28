// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** Custom Components
import Avatar from '@components/avatar'
// ** Third Party Components
import { Bell, X, Check, AlertTriangle, Inbox, XCircle } from 'react-feather'
import InfiniteScroll from "react-infinite-scroll-component"
// ** Utils
import { getUserData } from '../../../../utility/Utils'
import classnames from 'classnames'
// ** Reactstrap Imports
import { Button, Badge, Input, DropdownMenu, DropdownItem, DropdownToggle, UncontrolledDropdown, Row } from 'reactstrap'
// ** Laaravel Echo
import Pusher from "pusher-js"
import Echo from 'laravel-echo'
import ReactTimeAgo from 'react-time-ago'
import ComponentSpinner from '../../../components/spinner/Loading-spinner'
import { useNavigate } from 'react-router-dom'
import AudioSource from '@src/assets/audio/notification-bells.mp3'
import { getUserLanguage } from '../../../../configs/i18n'
import { useTranslation } from 'react-i18next'
import useAxiosAPI from '../../../../api/useAxiosAPI'
import useSWR from 'swr'
import { useGetAuthUserNotification } from '@src/api/AccountAPI'

const NotificationDropdown = () => {
  // ** Consts
  const audio = new Audio(AudioSource)
  // ** Hooks
  const navigate = useNavigate()
  const { t } = useTranslation()
  const axiosAPI = useAxiosAPI()
  const user = getUserData()
  // ** States
  const perPage = 10
  const [notifications, setNotifications] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [totalUnreadNotifications, setTotalUnreadNotifications] = useState(0)
  // ** Queries
  const getAuthUserNotification = useGetAuthUserNotification()
  useEffect(() => {
    const echo = new Echo({
      broadcaster: "pusher",
      key: "myPusherKey",
      wsHost: "127.0.0.1",
      wsPort: 6001,
      forceTLS: false,
      cluster: "mt1",
      disableStats: true,
      authorizer: (channel) => {
        return {
          authorize: (socketId, callback) => {
              axiosAPI.post('/api/broadcasting/auth', {
                  socket_id: socketId,
                  channel_name: channel.name
              })
              .then(response => {
                  callback(false, response.data);
              })
              .catch(error => {
                  callback(true, error);
              });
          }
        }
      }
    })
    echo.private(`App.Models.Admin.${user?.id}`).notification((notification) => {
      setNotifications((prevState) => { return [notification, ...prevState] })
      setTotalUnreadNotifications((prevState) => prevState + 1)
      audio.play()
    })
  }, [])

  const { isLoading } =useSWR(hasMore ? `users/notifications?page=${currentPage}&perPage=${perPage}` : null,
   () => getAuthUserNotification(currentPage, perPage), {
    onSuccess: (data) => {
      setNotifications((prevState) => { return [...prevState, ...data?.notifications] })
      setTotalUnreadNotifications(data?.totalUnreadNotifications)
      if (data?.notifications?.length === 0 || data.notifications?.length < perPage) {
        setHasMore(false)
      }
    }
   }
  )

  const onNotificationItemClicked = async (event, item) => {
    event.preventDefault()
    if (!item.read_at) {
      try {
        const response = await axiosAPI.get(`users/notifications/mark_as_read/${item.id}`)
        setNotifications((prevState) => {
          prevState.splice(prevState.findIndex((element) => element.id === item.id), 1, response.data)
          return prevState
        })
        setTotalUnreadNotifications((prevState) => prevState - 1)
      } catch (error) {
        console.log(error)
      }
    }
    item.data ? navigate(`${item.data.href}`) : navigate(`${item.href}`)
  }
  return (
    <Fragment>
      <UncontrolledDropdown tag='li' className='dropdown-notification nav-item me-25'>
        <DropdownToggle tag='a' className='nav-link' href='/' onClick={e => e.preventDefault()}>
          <Bell size={21} />
          <Badge pill color='danger' className='badge-up'>
            {totalUnreadNotifications}
          </Badge>
        </DropdownToggle>
        <DropdownMenu end tag='ul' className='dropdown-menu-media mt-0'>
          <li className='dropdown-menu-header'>
            <DropdownItem className='d-flex' tag='div' header>
              <h4 className='notification-title mb-0 me-auto'>{t("Notifications")}</h4>
              <Badge tag='div' color='light-primary' pill>
                {totalUnreadNotifications} {t("Nouvelle Notification")}
              </Badge>
            </DropdownItem>
          </li>
          <li className='media-list scrollable-container mail-read'>
            <InfiniteScroll
                dataLength={notifications.length}
                next={() => setCurrentPage((prevState) => prevState + 1)}
                hasMore={hasMore}
                loader={
                  <div className='dropdown-menu-footer m-0'>
                    <ComponentSpinner />
                  </div>
                }
                height={300}
                endMessage={
                    <p key={'endMessage'} style={{ textAlign: 'center'}} className='dropdown-menu-footer m-0'>
                        <b> {t("Plus de Notifications")} </b>
                    </p>
                }
              >,
              {notifications?.map((item, index) => {
                  return (
                    <a key={index} className='d-flex' onClick={event => onNotificationItemClicked(event, item)}>
                        <div className={classnames('list-item d-flex align-items-start', { 'bg-light-success': !item.read_at })}>
                            <Fragment>
                              <div className='me-1'>
                                <Avatar color={item.data ? item.data.color : item.color} icon={ <Check /> } />
                              </div>
                              <div className='list-item-body flex-grow-1'>
                                <p className='media-heading'>
                                  <span className='fw-bolder'>{item.data ? item.data.title : item.title}</span>&nbsp;
                                </p>
                                <div className='flex-grow-1 d-flex justify-content-between'>
                                  <small className='notification-text'>
                                    {item.data ? item.data.subtitle : item.subtitle}
                                  </small>
                                  <small className='notification-text'>
                                    <ReactTimeAgo date={item.data ? item.created_at : Date.now()} locale={getUserLanguage() === 'fr' ? 'fr' : 'ar'}></ReactTimeAgo>
                                  </small>
                                </div>
                              </div>
                            </Fragment>
                        </div>
                  </a>
                  ) 
              })}
            </InfiniteScroll>
          </li>
        </DropdownMenu>
      </UncontrolledDropdown>
    </Fragment>
  )
}

export default NotificationDropdown
