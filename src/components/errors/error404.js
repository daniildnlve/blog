import { Button, Result } from 'antd'
import { Link } from 'react-router-dom'

import { PATH_HOME_PAGE } from '../../path/path'

const Error404 = () => (
  <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={
      <Link to={PATH_HOME_PAGE}>
        <Button type="primary">Back Home</Button>
      </Link>
    }
  />
)
export default Error404
