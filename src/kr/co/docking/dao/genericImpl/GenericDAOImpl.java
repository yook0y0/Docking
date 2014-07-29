package kr.co.docking.dao.genericImpl;

import java.io.IOException;
import java.io.Reader;
import java.io.Serializable;
import java.util.List;

import kr.co.docking.dao.generic.GenericDAO;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import com.ibatis.common.resources.Resources;

public class GenericDAOImpl<T extends Serializable>	implements GenericDAO<T>
{
	private SqlSession	sqlSession;
	private String		mapper;
	
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
	public void add(List<T> list) throws RuntimeException 
	{
		connect();
		
		for(T t : list)
		{
			sqlSession.selectList(mapper, t);
		}
		
		disconnect();
	}

	@Override
	public void add(T t) throws RuntimeException 
	{
		connect();
		
		sqlSession.selectList(mapper, t);
		
		disconnect();
	}

	@Override
	public void modify(T t) throws RuntimeException 
	{
		connect();
		
		sqlSession.selectList(mapper, t);
		
		disconnect();
	}

	@Override
	public void modify(List<T> list) throws RuntimeException 
	{
		connect();
		
		for(T t : list)
		{
			sqlSession.selectList(mapper, t);
		}
		
		disconnect();
	}

	@SuppressWarnings("unchecked")
	@Override
	public T search(Object id) throws RuntimeException 
	{
		connect();
		
		T	t = (T)sqlSession.selectOne(mapper, id);
		
		disconnect();
		
		return t;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<T> searchAll() throws RuntimeException 
	{
		connect();
		
		List<T>	list = (List<T>)sqlSession.selectList(mapper);
		
		disconnect();
		
		return list;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<T> searchAll(Object id) throws RuntimeException 
	{
		connect();
		
		List<T>	list = (List<T>)sqlSession.selectList(mapper, id);
		
		disconnect();
		
		return list;
	}

	@Override
	public void delete(Object id) throws RuntimeException 
	{
		connect();
		
		sqlSession.selectList(mapper, id);
		
		disconnect();
	}

	@Override
	public void deleteAll(List<T> list) throws RuntimeException 
	{
		connect();
		
		for(T t : list)
		{
			sqlSession.selectList(mapper, t);
		}
		
		disconnect();
	}

	@Override
	public void deleteAll() throws RuntimeException 
	{
		connect();
		
		sqlSession.selectList(mapper);
		
		disconnect();
	}
}
