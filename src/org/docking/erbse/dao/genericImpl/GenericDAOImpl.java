package org.docking.erbse.dao.genericImpl;

import java.io.IOException;
import java.io.Reader;
import java.io.Serializable;
import java.util.List;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.docking.erbse.dao.generic.GenericDAO;

public class GenericDAOImpl<T extends Serializable>	implements GenericDAO<T>
{
	private SqlSession	sqlSession;
	private String		mapper;
	private	Integer		returnVal = 1;
	
	public void setMapper(String mapper) 
	{
		this.mapper = mapper;
	}
	
	private void connect()
	{
		String resource = "mybatis-config.xml";
		Reader reader = null;
		sqlSession = null;
		SqlSessionFactory	sqlMapper = null;
		
		try 
		{
			reader = Resources.getResourceAsReader(resource);

			sqlMapper = new SqlSessionFactoryBuilder().build(reader);
			
			sqlSession = sqlMapper.openSession();
		} 
		
		catch (IOException e) 
		{
			e.printStackTrace();
		}
	}
	
	private void disconnect()
	{
		sqlSession.close();
	}
	
	@Override
	public Integer add(List<T> list)
	{
		connect();
		
		for(T t : list)
		{
			try
			{
				sqlSession.insert(mapper, t);
				sqlSession.commit();
			}
			catch(RuntimeException e)
			{
				returnVal = 0;
				
				e.printStackTrace();
			}
		}
		
		disconnect();
		
		return returnVal;
	}

	@Override
	public Integer add(T t)
	{
		connect();
		
		try
		{
			sqlSession.insert(mapper, t);
			sqlSession.commit();
		}
		catch(RuntimeException e)
		{
			returnVal = 0;
		}
		
		disconnect();
		
		return returnVal;
	}

	@Override
	public Integer modify(T t)
	{
		connect();
		
		try
		{
			sqlSession.update(mapper, t);
			sqlSession.commit();
		}
		catch(RuntimeException e)
		{
			returnVal = 0;
		}
		
		
		disconnect();
		
		return returnVal;
	}

	@Override
	public Integer modify(List<T> list) 
	{
		connect();
		
		for(T t : list)
		{
			try
			{
				sqlSession.update(mapper, t);
				sqlSession.commit();
			}
			catch(RuntimeException e)
			{
				returnVal = 0;
			}
		}
		
		disconnect();
		
		return returnVal;
	}

	@SuppressWarnings("unchecked")
	@Override
	public T search(Object id)
	{
		connect();
		
		T	t = (T)sqlSession.selectOne(mapper, id);
		
		disconnect();
		
		return t;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<T> searchAll() 
	{
		connect();
		
		List<T>	list = (List<T>)sqlSession.selectList(mapper);
		
		disconnect();
		
		return list;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<T> searchAll(Object id) 
	{
		connect();
		
		List<T>	list = (List<T>)sqlSession.selectList(mapper, id);
		
		disconnect();
		
		return list;
	}

	@Override
	public Integer delete(Object id)
	{
		connect();
		
		try
		{
			sqlSession.delete(mapper, id);
			sqlSession.commit();
		}
		catch(RuntimeException e)
		{
			returnVal = 0;
		}
		
		disconnect();
		
		return returnVal;
	}

	@Override
	public Integer deleteAll(List<T> list)
	{
		connect();
		
		for(T t : list)
		{
			try
			{
				sqlSession.delete(mapper, t);
				sqlSession.commit();
			}
			catch(RuntimeException e)
			{
				returnVal = 0;
			}
		}
		
		disconnect();
		
		return returnVal;	
	}

	@Override
	public Integer deleteAll()
	{
		connect();
		
		try
		{
			sqlSession.delete(mapper);
			sqlSession.commit();
		}
		catch(RuntimeException e)
		{
			returnVal = 0;
		}
		
		disconnect();
		
		return returnVal;
	}
}
