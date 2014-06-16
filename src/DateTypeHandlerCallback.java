import java.sql.SQLException;

import com.ibatis.sqlmap.client.extensions.ResultGetter;


public class DateTypeHandlerCallback 
{
	public Object getResult(ResultGetter getter) throws SQLException 
	{
	    if (getter.getObject() != null && getter.getObject().getClass().getName().equals("java.sql.Date")) 
	    {
	        return getter.getTimestamp();
	    } 
	    
	    else 
	    {
	        return getter.getObject();
	    }
	} 
}
